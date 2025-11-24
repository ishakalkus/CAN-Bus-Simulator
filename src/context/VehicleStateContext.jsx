import React, { createContext, useContext, useReducer, useEffect } from 'react';

const VehicleStateContext = createContext();

const initialState = {
    ignition: 'OFF',
    engineRunning: false,
    rpm: 0,
    speed: 0,
    gear: 'P',
    currentGear: 1, // 1-6 for automatic
    accelerator: 0,
    brake: 0,
    steering: 0,
    fuel: 85,
    temp: 90,
    odometer: 12345,
    simulationSpeed: 1.0, // 0.1x to 2.0x

    // Body
    lights: {
        headlights: false,
        highBeams: false,
        leftTurn: false,
        rightTurn: false,
        hazards: false,
    },
    doors: {
        fl: false, fr: false, rl: false, rr: false,
        trunk: false, hood: false,
    },
    windows: { fl: 0, fr: 0, rl: 0, rr: 0 },
    locked: true,

    // Infotainment
    infotainment: {
        volume: 15,
        source: 'FM', // FM, BT, AUX
        track: 'Station 105.5',
    }
};

const vehicleReducer = (state, action) => {
    switch (action.type) {
        case 'SET_IGNITION':
            return { ...state, ignition: action.payload, engineRunning: action.payload === 'ON' || action.payload === 'START' ? state.engineRunning : false };
        case 'START_ENGINE':
            return { ...state, engineRunning: true, rpm: 800 };
        case 'STOP_ENGINE':
            return { ...state, engineRunning: false, rpm: 0, speed: 0 };
        case 'SET_GEAR':
            return { ...state, gear: action.payload, currentGear: 1 };
        case 'UPDATE_PHYSICS':
            return { ...state, ...action.payload };
        case 'SET_CONTROL':
            return { ...state, [action.payload.control]: action.payload.value };
        case 'TOGGLE_LIGHT':
            return {
                ...state,
                lights: { ...state.lights, [action.payload]: !state.lights[action.payload] }
            };
        case 'SET_TURN_SIGNAL':
            // payload: 'left', 'right', 'hazards', or 'off'
            if (action.payload === 'off') {
                return { ...state, lights: { ...state.lights, leftTurn: false, rightTurn: false, hazards: false } };
            }
            if (action.payload === 'hazards') {
                return { ...state, lights: { ...state.lights, hazards: !state.lights.hazards, leftTurn: false, rightTurn: false } };
            }
            return {
                ...state,
                lights: {
                    ...state.lights,
                    leftTurn: action.payload === 'left' ? !state.lights.leftTurn : false,
                    rightTurn: action.payload === 'right' ? !state.lights.rightTurn : false,
                    hazards: false
                }
            };
        case 'TOGGLE_DOOR':
            return {
                ...state,
                doors: { ...state.doors, [action.payload]: !state.doors[action.payload] }
            };
        case 'SET_SIMULATION_SPEED':
            return { ...state, simulationSpeed: action.payload };
        case 'SET_INFOTAINMENT':
            return { ...state, infotainment: { ...state.infotainment, ...action.payload } };
        default:
            return state;
    }
};

export const VehicleStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(vehicleReducer, initialState);
    const stateRef = React.useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (!state.engineRunning) return;

        // Adjust interval based on simulation speed? 
        // Actually, physics should run at constant delta time for stability, 
        // but we can scale the *changes* by simulationSpeed.
        // OR we can just slow down the interval. Let's slow down interval for "slow motion" effect.
        // But setInterval is not dynamic. We need a recursive timeout or just scale the deltas.
        // Scaling deltas is better for smooth UI.

        const interval = setInterval(() => {
            const currentState = stateRef.current;
            const simFactor = currentState.simulationSpeed;

            let newRpm = currentState.rpm;
            let newSpeed = currentState.speed;
            let newGear = currentState.currentGear;

            // Transmission Logic (Simple Automatic)
            const GEAR_RATIOS = [0, 3.5, 2.5, 1.8, 1.4, 1.0, 0.8]; // N, 1, 2, 3, 4, 5, 6
            const FINAL_DRIVE = 3.5;

            if (currentState.gear === 'D') {
                // Upshift
                if (newRpm > 4500 && newGear < 6) {
                    newGear++;
                    newRpm = newRpm * (GEAR_RATIOS[newGear] / GEAR_RATIOS[newGear - 1]);
                }
                // Downshift
                if (newRpm < 1500 && newGear > 1) {
                    newGear--;
                    newRpm = newRpm * (GEAR_RATIOS[newGear] / GEAR_RATIOS[newGear + 1]);
                }
            }

            // RPM Logic
            const targetRpm = 800 + (currentState.accelerator * 60);

            if (currentState.gear === 'N' || currentState.gear === 'P') {
                newRpm = newRpm + (targetRpm - newRpm) * 0.1 * simFactor;
            } else {
                // In gear: Speed = RPM / Ratio * Constant
                // So RPM = Speed * Ratio * Constant
                // We calculate target speed based on power, then derive RPM

                const ratio = GEAR_RATIOS[newGear] * FINAL_DRIVE;
                const speedToRpm = (s) => s * ratio * 25; // Approximate constant

                // Calculate target speed based on throttle (simplified power model)
                const maxSpeedForGear = 300 / ratio;
                const targetSpeed = (currentState.accelerator / 100) * maxSpeedForGear;

                // Accelerate
                if (newSpeed < targetSpeed) {
                    newSpeed += (currentState.accelerator * 0.02 * simFactor / newGear); // Less accel in high gear
                }
                // Coast/Drag
                if (currentState.accelerator === 0) {
                    newSpeed *= (1 - (0.01 * simFactor));
                }
                // Brake
                if (currentState.brake > 0) {
                    newSpeed -= (currentState.brake * 0.2 * simFactor);
                }

                if (newSpeed < 0) newSpeed = 0;

                // Calculate RPM from Speed
                newRpm = speedToRpm(newSpeed);
                if (newRpm < 800) newRpm = 800; // Idle
            }

            if (newRpm > 7000) newRpm = 7000; // Redline limiter

            if (Math.abs(newRpm - currentState.rpm) > 1 || Math.abs(newSpeed - currentState.speed) > 0.1 || newGear !== currentState.currentGear) {
                dispatch({
                    type: 'UPDATE_PHYSICS',
                    payload: { rpm: newRpm, speed: newSpeed, currentGear: newGear }
                });
            }

        }, 50);

        return () => clearInterval(interval);
    }, [state.engineRunning]);

    return (
        <VehicleStateContext.Provider value={{ state, dispatch }}>
            {children}
        </VehicleStateContext.Provider>
    );
};

export const useVehicleState = () => useContext(VehicleStateContext);
