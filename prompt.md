# CAN Bus Vehicle Network Simulator - Web Application

## Project Overview
Build a comprehensive, educational web application that simulates Controller Area Network (CAN) communication in a modern vehicle. The application should visualize real-time message exchanges between various Electronic Control Units (ECUs) and vehicle systems, making CAN bus protocols accessible and understandable for learners.

## Technical Requirements

### Deployment
- Must be compatible with GitHub Pages (static site)
- Single-page application using vanilla JavaScript, React, or Vue.js
- No backend server required - all simulation logic runs client-side
- Responsive design for desktop and mobile viewing

### Technology Stack Preferences
- Use React with modern hooks for state management
- Implement real-time visualization using HTML5 Canvas or SVG
- Use Tailwind CSS for styling
- Keep all assets and logic self-contained (no external API calls)

## Vehicle Systems to Simulate

### Powertrain Systems
1. **Engine Control Unit (ECU)**
   - RPM data
   - Throttle position
   - Engine temperature
   - Fuel injection timing
   - Air-fuel ratio
   - Engine load percentage

2. **Transmission Control Unit (TCU)**
   - Current gear position
   - Gear shift requests
   - Clutch position
   - Transmission temperature
   - Torque converter lock-up status

3. **Fuel System**
   - Fuel level
   - Fuel pump status
   - Fuel pressure
   - Fuel consumption rate

### Chassis & Safety Systems
4. **Anti-lock Braking System (ABS)**
   - Wheel speed sensors (all 4 wheels)
   - Brake pressure
   - ABS activation status
   - Individual wheel brake force

5. **Electronic Stability Control (ESC)**
   - Yaw rate
   - Lateral acceleration
   - Steering angle
   - ESC intervention status

6. **Airbag Control Unit**
   - Crash sensor data
   - Seatbelt status
   - Airbag deployment status
   - Pre-tensioner status

7. **Parking Assist System**
   - Ultrasonic sensor readings (front/rear)
   - Distance to obstacles
   - Parking guidance commands

### Body Electronics
8. **Body Control Module (BCM)**
   - Door lock/unlock status (all doors)
   - Window positions
   - Mirror adjustments
   - Central locking commands

9. **Lighting Control**
   - Headlight status (low/high beam)
   - Turn signals (left/right)
   - Brake lights
   - Interior lighting
   - Automatic headlight sensor

10. **Climate Control (HVAC)**
    - Temperature settings
    - Fan speed
    - AC compressor status
    - Recirculation mode
    - Defrost status

### Driver Assistance & Comfort
11. **Instrument Cluster**
    - Speedometer display
    - Odometer
    - Fuel gauge
    - Warning lights status
    - Trip computer data

12. **Infotainment System**
    - Audio volume
    - Media source selection
    - Navigation commands
    - Phone connectivity status
    - Screen touch inputs

13. **Steering Wheel Controls**
    - Media control buttons
    - Cruise control buttons
    - Voice command button
    - Phone buttons

14. **Power Steering (EPS)**
    - Steering assist level
    - Steering angle sensor
    - Steering torque

### Advanced Driver Assistance Systems (ADAS)
15. **Adaptive Cruise Control (ACC)**
    - Set speed
    - Following distance
    - Radar detection data
    - Acceleration/deceleration commands

16. **Lane Keeping Assist (LKA)**
    - Camera lane detection
    - Steering correction commands
    - Lane departure warnings

17. **Blind Spot Monitoring**
    - Sensor detection status
    - Warning indicator commands

18. **Battery Management System (for hybrid/electric)**
    - Battery state of charge
    - Battery temperature
    - Cell voltages
    - Charging status

19. **Tire Pressure Monitoring System (TPMS)**
    - Pressure readings (all 4 tires)
    - Temperature readings
    - Low pressure warnings

20. **Wiper Control**
    - Wiper speed settings
    - Rain sensor data
    - Washer fluid level

## CAN Bus Simulation Features

### Message Visualization
- **Live CAN Bus Monitor**: Scrolling list showing CAN frames in real-time
- **Message Format Display**: Show standard CAN 2.0A format
  - CAN ID (11-bit or 29-bit)
  - Data Length Code (DLC)
  - Data bytes (up to 8 bytes)
  - Timestamp
- **Color-coded messages** by system type
- **Message frequency indicators** (e.g., engine data at 100ms, door status at 500ms)

### Interactive Controls
- **Driving Simulator Panel**:
  - Accelerator pedal (0-100%)
  - Brake pedal (0-100%)
  - Steering wheel (-100% to +100%)
  - Gear selector (P, R, N, D, M)
  - Ignition switch (OFF, ACC, ON, START)

- **Vehicle Controls**:
  - Turn signals
  - Headlights
  - Door locks
  - Windows
  - Climate controls
  - Infotainment controls

### Visualization Components
1. **Network Topology View**: Show all ECUs connected to CAN bus
2. **Live Data Dashboard**: Real-time gauges and indicators
3. **Message Flow Diagram**: Animated visualization of message transmission
4. **Bus Load Meter**: Show CAN bus utilization percentage
5. **Error Frame Injection**: Allow simulating CAN errors

### Educational Features
- **Message Inspector**: Click any message to see detailed breakdown
- **System Highlighting**: Hover over ECU to highlight its messages
- **Scenario Presets**:
  - Normal driving
  - Emergency braking
  - Lane change
  - Starting the engine
  - ABS activation
- **Playback Controls**: Pause, slow down, speed up simulation
- **Tutorial Mode**: Step-by-step explanation of CAN communication

## Realistic CAN Bus Behavior

### Message Priorities
- Implement realistic CAN arbitration (lower ID = higher priority)
- Critical safety messages (brakes, airbags) get lowest IDs
- Infotainment messages get higher IDs

### Message Timing
- Different message types have different transmission frequencies:
  - Engine RPM: 10ms (100 Hz)
  - Wheel speeds: 20ms (50 Hz)
  - Steering angle: 20ms
  - Door status: 500ms (2 Hz)
  - Temperature: 1000ms (1 Hz)

### Realistic Data Dependencies
- Transmission gear changes based on speed and throttle
- ABS activates only during hard braking
- Engine RPM correlates with speed and gear
- Fuel consumption increases with throttle position

## UI/UX Requirements

### Layout
- **Left Panel**: Interactive vehicle controls
- **Center Panel**: Main visualization (choose between Network, Dashboard, or Message Flow)
- **Right Panel**: Live CAN message log
- **Bottom Panel**: Bus statistics and controls

### Design Aesthetics
- Modern, professional automotive industry look
- Dark theme with accent colors (blue, green, amber for warnings)
- Smooth animations for data updates
- Clear typography for message hex values

### Accessibility
- Keyboard navigation support
- Clear labels and tooltips
- Legend explaining color codes and symbols
- Responsive design for various screen sizes

## Technical Implementation Details

### CAN Message Structure
```
Example CAN Frame:
ID: 0x180 (Engine RPM)
DLC: 8
Data: [0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0]
```

### State Management
- Use React Context or Redux for global vehicle state
- Separate state slices for each vehicle system
- Computed values derive from user inputs (e.g., speed from RPM and gear)

### Performance Optimization
- Throttle message rendering to prevent UI lag
- Use virtual scrolling for CAN message log
- Implement efficient canvas/SVG rendering
- Keep message history to last 1000 messages

## Deliverables

1. **Complete React Application**
   - Fully functional CAN bus simulator
   - All vehicle systems implemented
   - Interactive controls working

2. **Documentation**
   - README.md with setup instructions
   - Brief CAN bus protocol explanation
   - How to use the simulator
   - List of simulated CAN IDs and their meanings

3. **GitHub Pages Deployment**
   - Build configuration for GitHub Pages
   - Deployed URL ready to share

4. **Code Quality**
   - Clean, well-commented code
   - Modular component structure
   - Reusable CAN message utilities

## Bonus Features (If Time Permits)

- Export CAN logs to standard formats (.log, .csv)
- Multiple CAN bus channels (High-speed, Low-speed, Infotainment)
- CAN FD (Flexible Data-rate) simulation
- Network error simulation (bus-off, error frames)
- Save/load vehicle state scenarios
- Dark/Light theme toggle

## Success Criteria

- Application loads and runs on GitHub Pages without errors
- At least 15 vehicle systems actively communicating
- Smooth real-time visualization with 60fps
- User can interact with vehicle controls and see immediate CAN message updates
- Educational value is clear through tooltips and visual feedback
- Code is clean, documented, and maintainable