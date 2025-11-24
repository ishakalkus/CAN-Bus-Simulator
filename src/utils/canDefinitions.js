// CAN ID Definitions
export const CAN_IDS = {
    ENGINE_RPM: 0x180,
    VEHICLE_SPEED: 0x200,
    THROTTLE_POSITION: 0x182,
    BRAKE_PRESSURE: 0x202,
    STEERING_ANGLE: 0x190,
    GEAR_STATUS: 0x192,
    TURN_SIGNALS: 0x300,
    LIGHTS_STATUS: 0x302,
    DOOR_STATUS: 0x400,
    FUEL_LEVEL: 0x500,
    BATTERY_VOLTAGE: 0x502,
    ODOMETER: 0x600,
    INFOTAINMENT_STATUS: 0x550, // New
};

// System Colors for Visualization
export const SYSTEM_COLORS = {
    POWERTRAIN: 'text-red-400',
    CHASSIS: 'text-blue-400',
    BODY: 'text-green-400',
    INFOTAINMENT: 'text-purple-400',
    ADAS: 'text-yellow-400',
};

export const getSystemType = (canId) => {
    if (canId >= 0x100 && canId < 0x200) return 'POWERTRAIN';
    if (canId >= 0x200 && canId < 0x300) return 'CHASSIS';
    if (canId >= 0x300 && canId < 0x500) return 'BODY';
    if (canId >= 0x500 && canId < 0x600) return 'INFOTAINMENT';
    return 'ADAS';
};

// Helper to format data bytes as hex string
export const formatDataBytes = (data) => {
    return data.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
};
