import React from 'react';
import { useVehicleState } from '../../context/VehicleStateContext';

const Gauge = ({ value, max, label, unit, color = 'blue' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const rotation = (percentage / 100) * 240 - 120; // -120 to +120 degrees

    // Generate ticks
    const ticks = [];
    for (let i = 0; i <= 10; i++) {
        const tickRot = (i / 10) * 240 - 120;
        ticks.push(
            <line
                key={i}
                x1="50" y1="10"
                x2="50" y2={i % 2 === 0 ? "18" : "14"}
                stroke="#475569"
                strokeWidth={i % 2 === 0 ? "2" : "1"}
                transform={`rotate(${tickRot} 50 50)`}
            />
        );
    }

    return (
        <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Background Arc */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Ticks */}
                {ticks}

                {/* Main Arc */}
                <path
                    d="M 20.6 82.6 A 45 45 0 1 1 79.4 82.6"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Value Arc */}
                <path
                    d="M 20.6 82.6 A 45 45 0 1 1 79.4 82.6"
                    fill="none"
                    stroke={color === 'red' ? '#ef4444' : '#3b82f6'}
                    strokeWidth="8"
                    strokeDasharray={`${(percentage / 100) * 212} 300`} // Approx arc length
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                    transform="rotate(0 50 50)" // Reset transform context
                />
            </svg>

            {/* Text */}
            <div className="absolute flex flex-col items-center mt-4">
                <span className={`text-5xl font-bold font-mono ${color === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                    {Math.round(value)}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">{unit}</span>
            </div>
            <div className="absolute bottom-10 text-sm font-medium text-slate-400 uppercase tracking-widest">{label}</div>
        </div>
    );
};

const Dashboard = () => {
    const { state } = useVehicleState();

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 bg-slate-900">
            <div className="flex gap-8 items-center">
                <Gauge
                    value={state.rpm}
                    max={8000}
                    label="RPM"
                    unit=""
                    color="red"
                />

                {/* Center Info */}
                <div className="flex flex-col items-center justify-center w-32 h-32 bg-slate-800 rounded-2xl border-4 border-slate-700 shadow-inner">
                    <div className="text-slate-400 text-xs font-bold mb-1">GEAR</div>
                    <div className="text-6xl font-black text-white">
                        {state.gear === 'D' ? state.currentGear : state.gear}
                    </div>
                </div>

                <Gauge
                    value={state.speed}
                    max={240}
                    label="Speed"
                    unit="KM/H"
                    color="blue"
                />
            </div>

            {/* Indicators */}
            <div className="flex gap-6 bg-black/40 px-10 py-4 rounded-full border border-slate-800 backdrop-blur-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${state.lights.leftTurn ? 'text-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-slate-800'}`}>
                    ⬅
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${state.lights.headlights ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-slate-800'}`}>
                    💡
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${state.lights.highBeams ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-slate-800'}`}>
                    🔦
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!state.engineRunning && state.ignition !== 'OFF' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-800'}`}>
                    🔋
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${state.lights.rightTurn ? 'text-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-slate-800'}`}>
                    ➡
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
