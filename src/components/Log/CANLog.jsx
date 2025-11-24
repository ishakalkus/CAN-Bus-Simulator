import React, { useEffect, useRef } from 'react';
import { useCANBus } from '../../hooks/useCANBus';
import { CAN_IDS, getSystemType, SYSTEM_COLORS, formatDataBytes } from '../../utils/canDefinitions';
import { Play, Pause, Trash2 } from 'lucide-react';

const CANLog = () => {
    const { messages, isPaused, setIsPaused, clearLog } = useCANBus();
    const logEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (!isPaused && logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isPaused]);

    const [selectedMessage, setSelectedMessage] = React.useState(null);

    const getMessageName = (id) => {
        const entry = Object.entries(CAN_IDS).find(([key, val]) => val === id);
        return entry ? entry[0] : 'UNKNOWN';
    };

    const getMessageDetails = (msg) => {
        const name = getMessageName(msg.id);

        switch (name) {
            case 'ENGINE_RPM':
                const rpm = (msg.data[0] << 8) | msg.data[1];
                return `RPM: ${rpm}`;
            case 'VEHICLE_SPEED':
                const speed = ((msg.data[0] << 8) | msg.data[1]) / 100;
                return `Speed: ${speed.toFixed(2)} km/h`;
            case 'THROTTLE_POSITION':
                return `Throttle: ${msg.data[0]}%`;
            case 'GEAR_STATUS':
                const gearMap = ['P', 'R', 'N', 'D'];
                return `Gear: ${gearMap[msg.data[0]] || 'Unknown'} (${msg.data[1]})`;
            case 'DOOR_STATUS':
                const doors = [];
                if (msg.data[0] & 1) doors.push('FL');
                if (msg.data[0] & 2) doors.push('FR');
                if (msg.data[0] & 4) doors.push('RL');
                if (msg.data[0] & 8) doors.push('RR');
                return `Doors Open: ${doors.length > 0 ? doors.join(', ') : 'None'}`;
            case 'LIGHTS_STATUS':
                const lights = [];
                if (msg.data[0] & 1) lights.push('Headlights');
                if (msg.data[0] & 2) lights.push('High Beams');
                return `Lights: ${lights.length > 0 ? lights.join(', ') : 'Off'}`;
            case 'TURN_SIGNALS':
                const signals = [];
                if (msg.data[0] & 1) signals.push('Left');
                if (msg.data[0] & 2) signals.push('Right');
                if (msg.data[0] & 4) signals.push('Hazards');
                return `Signal: ${signals.length > 0 ? signals.join(', ') : 'Off'}`;
            case 'INFOTAINMENT_STATUS':
                const sources = ['FM', 'BT', 'AUX'];
                return `Vol: ${msg.data[0]} | Src: ${sources[msg.data[1]] || 'Unknown'}`;
            default:
                return '';
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                <div className="text-xs text-slate-500">
                    {messages.length} messages
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                        title={isPaused ? "Resume" : "Pause"}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button
                        onClick={clearLog}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
                        title="Clear Log"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Log List */}
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-2 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-slate-600 text-center mt-10 italic">
                        No messages captured...
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const system = getSystemType(msg.id);
                    const colorClass = SYSTEM_COLORS[system] || 'text-slate-400';
                    const details = getMessageDetails(msg);
                    const name = getMessageName(msg.id);

                    return (
                        <div
                            key={`${msg.timestamp}-${idx}`}
                            className="flex flex-col hover:bg-slate-900 p-2 rounded border-b border-slate-800/50 group"
                        >
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-2 text-slate-500">
                                    {(msg.timestamp % 10000).toString().padStart(4, '0')}
                                </div>
                                <div className={`col-span-3 font-bold ${colorClass}`}>
                                    0x{msg.id.toString(16).toUpperCase()}
                                </div>
                                <div className="col-span-7 text-slate-300 break-all">
                                    {formatDataBytes(msg.data)}
                                </div>
                            </div>

                            {/* Inline Details */}
                            <div className="mt-1 pl-14 text-slate-500 flex justify-between items-center">
                                <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-600">{name}</span>
                                {details && <span className="text-green-400/80">{details}</span>}
                            </div>
                        </div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default CANLog;
