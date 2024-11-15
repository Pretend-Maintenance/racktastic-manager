import { Location, Device, Rack, NetworkAdapter, LogEntry } from "./types";

const STORAGE_KEY = "datacenter_state";
const STATUS_KEY = "datacenter_status";

const getDeviceDetails = (device: Device) => ({
  type: device.type,
  manufacturer: device.manufacturer,
  model: device.model,
  status: device.status,
  position: `U${device.position}`,
  height: `${device.height}U`,
});

// Enhanced logging function with detailed changes
const logTransaction = (action: string, itemType: "device" | "rack" | "networkAdapter", itemName: string, changes: any[] = [], device?: Device) => {
  const logEntry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: "admin",
    action,
    itemType,
    itemId: crypto.randomUUID(),
    itemName,
    changes,
  };

  if (device) {
    logEntry.deviceDetails = getDeviceDetails(device);
  }
  
  console.log("Logging transaction:", logEntry);
  localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
};

export const saveState = (location: Location, action?: string, changes?: any[]) => {
  // Save current state
  localStorage.setItem(STATUS_KEY, JSON.stringify(location));
  
  if (action) {
    logTransaction(action, "rack", location.name, changes);
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
      const updatedDevice = {
        ...device,
        networkAdapters: device.networkAdapters.map(adapter => 
          adapter.id === adapterId ? {
            ...adapter,
            connected,
            connectedToDevice: connected ? targetDeviceId : undefined
          } : adapter
        )
      };
      
      // Log the changes for the source device
      logTransaction(
        connected ? "Connected" : "Disconnected",
        "device",
        device.name,
        [{
          field: "Network Connection",
          oldValue: connected ? "Disconnected" : "Connected",
          newValue: connected ? "Connected" : "Disconnected"
        }],
        updatedDevice
      );
      
      return updatedDevice;
    }
    
    // Update target device
    if (device.id === targetDeviceId) {
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

      const updatedDevice = {
        ...device,
        networkAdapters: updatedAdapters
      };

      // Log the changes for the target device
      logTransaction(
        connected ? "Connected" : "Disconnected",
        "device",
        device.name,
        [{
          field: "Network Connection",
          oldValue: connected ? "Disconnected" : "Connected",
          newValue: connected ? "Connected" : "Disconnected"
        }],
        updatedDevice
      );

      return updatedDevice;
    }
    return device;
  });
};