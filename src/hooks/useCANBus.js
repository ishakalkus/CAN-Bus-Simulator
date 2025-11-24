import { useState, useEffect, useRef } from 'react';
import { useVehicleState } from '../context/VehicleStateContext';
import { CAN_IDS } from '../utils/canDefinitions';

const MAX_LOG_SIZE = 1000;

export const useCANBus = () => {
    const { state } = useVehicleState();
    const [messages, setMessages] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    // Use ref to keep track of messages without triggering re-renders on every single message
    // We will batch updates or update at a lower frequency for UI
    const messagesRef = useRef([]);

    const addMessage = (id, data) => {
        if (isPaused) return;

        const newMessage = {
            id,
            timestamp: Date.now(),
            dlc: data.length,
            data,
        };

        messagesRef.current = [newMessage, ...messagesRef.current].slice(0, MAX_LOG_SIZE);
    };

    // Sync ref to state for UI rendering (throttled)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setMessages([...messagesRef.current]);
            }
        }, 100); // Update UI every 100ms

        return () => clearInterval(interval);
    }, [isPaused]);

    // Keep ref in sync with state for simulation loops
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Simulation Loops for different systems
    useEffect(() => {
        // We use a recursive timeout pattern instead of setInterval to allow dynamic speed adjustment
        let powertrainTimeout;
        let bodyTimeout;
        let infotainmentTimeout;

        const runPowertrainLoop = () => {
            const currentState = stateRef.current;
            const delay = 50 / currentState.simulationSpeed; // Scale delay

            if (currentState.ignition !== 'OFF') {
                // Engine RPM (0x180)
                if (currentState.engineRunning) {
                    const rpm = Math.floor(currentState.rpm);
                    const rpmBytes = [(rpm >> 8) & 0xFF, rpm & 0xFF, 0, 0, 0, 0, 0, 0];
                    addMessage(CAN_IDS.ENGINE_RPM, rpmBytes);
                }

                // Vehicle Speed (0x200)
                const speed = Math.floor(currentState.speed * 100);
                const speedBytes = [(speed >> 8) & 0xFF, speed & 0xFF, 0, 0, 0, 0, 0, 0];
                addMessage(CAN_IDS.VEHICLE_SPEED, speedBytes);

                // Throttle (0x182)
                addMessage(CAN_IDS.THROTTLE_POSITION, [currentState.accelerator, 0, 0, 0, 0, 0, 0, 0]);

                // Gear (0x192)
                const gearMap = { 'P': 0, 'R': 1, 'N': 2, 'D': 3 };
                addMessage(CAN_IDS.GEAR_STATUS, [gearMap[currentState.gear], currentState.currentGear, 0, 0, 0, 0, 0, 0]);
            }

            powertrainTimeout = setTimeout(runPowertrainLoop, delay);
        };

        const runBodyLoop = () => {
            const currentState = stateRef.current;
            const delay = 500 / currentState.simulationSpeed;

            if (currentState.ignition !== 'OFF') {
                // Doors (0x400)
                let doorByte = 0;
                if (currentState.doors.fl) doorByte |= 1;
                if (currentState.doors.fr) doorByte |= 2;
                if (currentState.doors.rl) doorByte |= 4;
                if (currentState.doors.rr) doorByte |= 8;
                addMessage(CAN_IDS.DOOR_STATUS, [doorByte, 0, 0, 0, 0, 0, 0, 0]);

                // Lights (0x302)
                let lightByte = 0;
                if (currentState.lights.headlights) lightByte |= 1;
                if (currentState.lights.highBeams) lightByte |= 2;
                addMessage(CAN_IDS.LIGHTS_STATUS, [lightByte, 0, 0, 0, 0, 0, 0, 0]);

                // Turn Signals (0x300)
                let turnByte = 0;
                if (currentState.lights.leftTurn) turnByte |= 1;
                if (currentState.lights.rightTurn) turnByte |= 2;
                if (currentState.lights.hazards) turnByte |= 4;
                addMessage(CAN_IDS.TURN_SIGNALS, [turnByte, 0, 0, 0, 0, 0, 0, 0]);
            }

            bodyTimeout = setTimeout(runBodyLoop, delay);
        };

        const runInfotainmentLoop = () => {
            const currentState = stateRef.current;
            const delay = 1000 / currentState.simulationSpeed;

            if (currentState.ignition !== 'OFF') {
                // Infotainment (0x550)
                // Byte 0: Volume, Byte 1: Source (0=FM, 1=BT, 2=AUX)
                const sourceMap = { 'FM': 0, 'BT': 1, 'AUX': 2 };
                addMessage(CAN_IDS.INFOTAINMENT_STATUS, [
                    currentState.infotainment.volume,
                    sourceMap[currentState.infotainment.source] || 0,
                    0, 0, 0, 0, 0, 0
                ]);
            }

            infotainmentTimeout = setTimeout(runInfotainmentLoop, delay);
        };

        // Start loops
        runPowertrainLoop();
        runBodyLoop();
        runInfotainmentLoop();

        return () => {
            clearTimeout(powertrainTimeout);
            clearTimeout(bodyTimeout);
            clearTimeout(infotainmentTimeout);
        };
    }, [isPaused]);

    return {
        messages,
        isPaused,
        setIsPaused,
        clearLog: () => {
            messagesRef.current = [];
            setMessages([]);
        }
    };
};
