import React from 'react';

const MainLayout = ({ leftPanel, centerPanel, rightPanel, bottomPanel }) => {
    return (
        <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden">
            {/* Left Panel - Controls */}
            <div className="w-1/4 border-r border-slate-700 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Vehicle Controls</h2>
                {leftPanel}
            </div>

            {/* Center Panel - Visualization */}
            <div className="flex-1 flex flex-col border-r border-slate-700">
                <div className="flex-1 p-4 relative bg-slate-800">
                    {centerPanel}
                </div>
                {/* Bottom Panel - Stats */}
                <div className="h-48 border-t border-slate-700 p-4 bg-slate-900">
                    {bottomPanel}
                </div>
            </div>

            {/* Right Panel - CAN Log */}
            <div className="w-1/4 p-4 bg-black font-mono text-sm overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-green-400">CAN Bus Monitor</h2>
                {rightPanel}
            </div>
        </div>
    );
};

export default MainLayout;
