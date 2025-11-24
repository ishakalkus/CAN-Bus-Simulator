import React from 'react';
import { useVehicleState } from '../../context/VehicleStateContext';
import { Lightbulb, Lock, Unlock, DoorOpen, Volume2, Radio, Music, Gauge } from 'lucide-react';

const VehicleControls = () => {
  const { state, dispatch } = useVehicleState();

  return (
    <div className="space-y-6 mt-6">
      {/* Simulation Speed */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-400">Simulation Speed</h3>
          <span className="text-xs font-mono text-blue-400">{state.simulationSpeed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={state.simulationSpeed}
          onChange={(e) => dispatch({ type: 'SET_SIMULATION_SPEED', payload: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Lighting & Signals */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Lighting & Signals</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LIGHT', payload: 'headlights' })}
            className={`flex items-center justify-center gap-2 p-2 rounded transition-colors ${state.lights.headlights ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-slate-700 text-slate-400'
              }`}
          >
            <Lightbulb size={18} /> Headlights
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LIGHT', payload: 'highBeams' })}
            className={`flex items-center justify-center gap-2 p-2 rounded transition-colors ${state.lights.highBeams ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-700 text-slate-400'
              }`}
          >
            <Lightbulb size={18} /> High Beams
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_TURN_SIGNAL', payload: state.lights.leftTurn ? 'off' : 'left' })}
            className={`p-2 rounded transition-colors flex justify-center ${state.lights.leftTurn ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse' : 'bg-slate-700 text-slate-400'}`}
          >
            ⬅
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_TURN_SIGNAL', payload: 'hazards' })}
            className={`p-2 rounded transition-colors flex justify-center ${state.lights.hazards ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-slate-700 text-slate-400'}`}
          >
            ⚠
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_TURN_SIGNAL', payload: state.lights.rightTurn ? 'off' : 'right' })}
            className={`p-2 rounded transition-colors flex justify-center ${state.lights.rightTurn ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse' : 'bg-slate-700 text-slate-400'}`}
          >
            ➡
          </button>
        </div>
      </div>

      {/* Infotainment */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Infotainment</h3>
        <div className="flex gap-2 mb-4">
          {['FM', 'BT', 'AUX'].map(src => (
            <button
              key={src}
              onClick={() => dispatch({ type: 'SET_INFOTAINMENT', payload: { source: src } })}
              className={`flex-1 p-2 rounded text-xs font-bold ${state.infotainment.source === src ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              {src}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Volume2 size={18} className="text-slate-400" />
          <input
            type="range"
            min="0"
            max="30"
            value={state.infotainment.volume}
            onChange={(e) => dispatch({ type: 'SET_INFOTAINMENT', payload: { volume: parseInt(e.target.value) } })}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-xs font-mono w-6 text-right text-slate-300">{state.infotainment.volume}</span>
        </div>
      </div>

      {/* Doors */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Doors</h3>
        <div className="grid grid-cols-2 gap-2">
          {['fl', 'fr', 'rl', 'rr'].map((door) => (
            <button
              key={door}
              onClick={() => dispatch({ type: 'TOGGLE_DOOR', payload: door })}
              className={`flex items-center justify-center gap-2 p-2 rounded transition-colors ${state.doors[door] ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-700 text-slate-400'
                }`}
            >
              <DoorOpen size={18} /> {door.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleControls;
