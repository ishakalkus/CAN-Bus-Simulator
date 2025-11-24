# CAN Bus Vehicle Network Simulator

An interactive, educational web application that simulates Controller Area Network (CAN) communication in a modern vehicle. Built with React and Vite, this simulator provides real-time visualization of CAN messages and vehicle dynamics.

**[Live Demo](https://ishakalkus.github.io/CAN-Bus-Simulator/)**

## Features

### Interactive Vehicle Controls
- **Ignition System**: OFF → ACC → ON → START states
- **Automatic Transmission**: 6-speed transmission with realistic gear shifting (1-6)
- **Driving Controls**: Accelerator, brake, steering
- **Turn Signals**: Left, right, and hazard lights with dashboard indicators
- **Lighting**: Headlights and high beams
- **Body Controls**: Individual door status (FL, FR, RL, RR)
- **Infotainment**: Volume control and source selection (FM, BT, AUX)

### Real-Time Dashboard
- **Analog Gauges**: RPM (0-8000) and Speed (0-240 km/h) with visual ticks
- **Gear Display**: Shows current gear (P/R/N/D/1-6)
- **Status Indicators**: Turn signals, lights, battery, and engine status
- **Realistic Physics**: Gear-based acceleration, engine braking, and transmission logic

### CAN Bus Monitor
- **Live Message Stream**: Real-time CAN frame logging with color-coded system types
- **Inline Explanations**: Human-readable interpretation under each message
- **Message Inspector**: Click any message for detailed breakdown
- **Simulation Speed Control**: Slow down time (0.1x - 2.0x) to analyze messages
- **Pause/Clear**: Control log playback

### Technical Implementation
- **Realistic Transmission**: Automatic upshifts/downshifts based on RPM
- **Multi-System Simulation**: Powertrain (20Hz), Body (2Hz), Infotainment (1Hz)
- **CAN Message Types**: 
  - Engine RPM (0x180)
  - Vehicle Speed (0x200)
  - Throttle Position (0x182)
  - Gear Status (0x192)
  - Turn Signals (0x300)
  - Lights (0x302)
  - Doors (0x400)
  - Infotainment (0x550)

## Tech Stack

- **Frontend**: React 19 with Hooks
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm 11+

### Installation

```bash
# Clone the repository
git clone https://github.com/ishakalkus/CAN-Bus-Simulator.git
cd CAN-Bus-Simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push to the `gh-pages` branch automatically.

## Project Structure

```
src/
├── components/
│   ├── Controls/
│   │   ├── DrivingControls.jsx    # Ignition, gear, pedals
│   │   └── VehicleControls.jsx    # Lights, doors, infotainment, sim speed
│   ├── Visualization/
│   │   └── Dashboard.jsx          # Gauges and indicators
│   ├── Log/
│   │   └── CANLog.jsx            # Message monitor with inline explanations
│   └── Layout/
│       └── MainLayout.jsx         # Grid layout
├── context/
│   └── VehicleStateContext.jsx    # Global state + physics simulation
├── hooks/
│   └── useCANBus.js              # CAN message generation
└── utils/
    └── canDefinitions.js          # CAN ID mappings and utilities
```

## How It Works

1. **Physics Simulation**: Runs at 20Hz, calculating RPM and speed based on throttle, brake, and current gear
2. **Automatic Transmission**: Shifts gears based on RPM thresholds (upshift at 4500, downshift at 1500)
3. **CAN Message Generation**: Different systems broadcast at realistic frequencies using recursive timeouts scaled by simulation speed
4. **State Management**: React Context API with reducer pattern for predictable state updates

## License

This project is open source and available under the MIT License.

## Author

**Ishak Alkus**
- GitHub: [@ishakalkus](https://github.com/ishakalkus)
- Email: ishakalkus@gmail.com

## Acknowledgments

Built as an educational tool to understand CAN bus communication in automotive systems.
