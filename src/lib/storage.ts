import { Location, Device, Rack, NetworkAdapter } from "./types";

const STORAGE_KEY = "datacenter_state";
const STATUS_KEY = "datacenter_status";

// Enhanced logging function with detailed changes
const logTransaction = (action: string, itemType: string, itemName: string, changes: any[] = []) => {
  const logEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: "admin",
    action,
    itemType,
    itemId: crypto.randomUUID(),
    itemName,
    changes,
  };
  
  console.log("Logging transaction:", logEntry);
  localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
};

// Save both transaction log and current state
export const saveState = (location: Location, action?: string, changes?: any[]) => {
  // Save current state
  localStorage.setItem(STATUS_KEY, JSON.stringify(location));
  
  if (action) {
    logTransaction(action, "location", location.name, changes);
  }
};

// Load the current state
export const loadState = (): Location | null => {
  const saved = localStorage.getItem(STATUS_KEY);
  return saved ? JSON.parse(saved) : null;
};

// Helper function to create network adapters based on device type
export const createDefaultAdapters = (deviceType: string): NetworkAdapter[] => {
  const createAdapter = (index: number): NetworkAdapter => ({
    id: crypto.randomUUID(),
    name: `Port ${index}`,
    type: "ethernet",
    speed: "1Gbit",
    port: `${index}`,
    connected: false,
  });

  switch (deviceType) {
    case "switch-4":
      return Array.from({ length: 4 }, (_, i) => createAdapter(i + 1));
    case "switch-24":
      return Array.from({ length: 24 }, (_, i) => createAdapter(i + 1));
    case "firewall":
      return Array.from({ length: 4 }, (_, i) => createAdapter(i + 1));
    default:
      return [createAdapter(1)]; // Default single adapter for other devices
  }
};

// Helper function to update connected devices
export const updateConnectedDevices = (
  devices: Device[],
  sourceDevice: Device,
  targetDeviceId: string,
  adapterId: string,
  connected: boolean
): Device[] => {
  console.log("Updating connected devices:", { sourceDevice, targetDeviceId, adapterId, connected });
  
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