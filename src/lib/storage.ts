import { Location, Device, Rack, NetworkAdapter } from "./types";

const STORAGE_KEY = "datacenter_state";
const STATUS_KEY = "datacenter_status";

// Save both transaction log and current state
export const saveState = (location: Location) => {
  // Save current state
  localStorage.setItem(STATUS_KEY, JSON.stringify(location));
  
  // Log the transaction
  const logEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: "admin",
    action: "Updated Configuration",
    itemType: "location",
    itemId: location.id,
    itemName: location.name,
    changes: [],
  };
  localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
};

// Load the current state
export const loadState = (): Location | null => {
  const saved = localStorage.getItem(STATUS_KEY);
  return saved ? JSON.parse(saved) : null;
};

// Helper function to update connected devices
export const updateConnectedDevices = (
  devices: Device[],
  sourceDevice: Device,
  targetDeviceId: string,
  adapterId: string,
  connected: boolean
): Device[] => {
  return devices.map(device => {
    // Update source device
    if (device.id === sourceDevice.id) {
      return {
        ...device,
        networkAdapters: device.networkAdapters.map(adapter => 
          adapter.id === adapterId ? {
            ...adapter,
            connected,
            connectedToDevice: connected ? targetDeviceId : undefined
          } : adapter
        )
      };
    }
    // Update target device
    if (device.id === targetDeviceId) {
      // Find or create a corresponding network adapter in the target device
      const targetAdapter = device.networkAdapters.find(adapter => 
        adapter.connectedToDevice === sourceDevice.id
      ) || {
        id: crypto.randomUUID(),
        name: "Auto-created Connection",
        type: "ethernet",
        speed: "1GbE",
        port: "Auto",
        connected: false
      };

      const updatedAdapters = device.networkAdapters.includes(targetAdapter)
        ? device.networkAdapters.map(adapter =>
            adapter.id === targetAdapter.id ? {
              ...adapter,
              connected,
              connectedToDevice: connected ? sourceDevice.id : undefined
            } : adapter
          )
        : [...device.networkAdapters, {
            ...targetAdapter,
            connected,
            connectedToDevice: connected ? sourceDevice.id : undefined
          }];

      return {
        ...device,
        networkAdapters: updatedAdapters
      };
    }
    return device;
  });
};