import React from 'react';
import { useVehicleState } from '../../context/VehicleStateContext';

const DrivingControls = () => {
    const { state, dispatch } = useVehicleState();

    const handleIgnition = (e) => {
        const val = e.target.value;
        dispatch({ type: 'SET_IGNITION', payload: val });
        if (val === 'START') {
            setTimeout(() => {
                dispatch({ type: 'START_ENGINE' });
                dispatch({ type: 'SET_IGNITION', payload: 'ON' });
            }, 1000);
        } else if (val === 'OFF') {
            dispatch({ type: 'STOP_ENGINE' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Ignition */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <label className="block text-sm font-medium text-slate-400 mb-2">Ignition</label>
                <div className="flex gap-2">
                    {['OFF', 'ACC', 'ON', 'START'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleIgnition({ target: { value: mode } })}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${state.ignition === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gear Selector */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <label className="block text-sm font-medium text-slate-400 mb-2">Gear Selector</label>
                <div className="flex gap-2">
                    {['P', 'R', 'N', 'D'].map((gear) => (
                        <button
                            key={gear}
                            onClick={() => dispatch({ type: 'SET_GEAR', payload: gear })}
                            className={`w-10 h-10 rounded-full font-bold transition-colors ${state.gear === gear
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/50'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {gear}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pedals */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Accelerator ({state.accelerator}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.accelerator}
                        onChange={(e) => dispatch({ type: 'SET_CONTROL', payload: { control: 'accelerator', value: parseInt(e.target.value) } })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Brake ({state.brake}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.brake}
                        onChange={(e) => dispatch({ type: 'SET_CONTROL', payload: { control: 'brake', value: parseInt(e.target.value) } })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default DrivingControls;
