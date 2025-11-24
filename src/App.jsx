import React from 'react';
import { VehicleStateProvider } from './context/VehicleStateContext';
import MainLayout from './components/Layout/MainLayout';
import DrivingControls from './components/Controls/DrivingControls';
import VehicleControls from './components/Controls/VehicleControls';
import Dashboard from './components/Visualization/Dashboard';
import CANLog from './components/Log/CANLog';

function App() {
  return (
    <VehicleStateProvider>
      <MainLayout
        leftPanel={
          <>
            <DrivingControls />
            <VehicleControls />
          </>
        }
        centerPanel={<Dashboard />}
        rightPanel={<CANLog />}
        bottomPanel={
          <div className="flex justify-between items-center h-full text-slate-400 text-sm">
            <div>
              <span className="font-bold text-slate-200">CAN Bus Simulator</span> v1.0
            </div>
            <div className="flex gap-4">
              <div>Bus Load: <span className="text-green-400">12%</span></div>
              <div>Errors: <span className="text-green-400">0</span></div>
              <div>Status: <span className="text-green-400">ONLINE</span></div>
            </div>
          </div>
        }
      />
    </VehicleStateProvider>
  );
}

export default App;
