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
  console.log("Logging transaction:", { action, itemType, itemName, changes, device });
  
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
  
  localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
};

export const saveState = (location: Location, action?: string, changes?: any[]) => {
  localStorage.setItem(STATUS_KEY, JSON.stringify(location));
  
  if (action) {
    logTransaction(action, "rack", location.name, changes || []);
  }
};

export const loadState = (): Location | null => {
  const saved = localStorage.getItem(STATUS_KEY);
  return saved ? JSON.parse(saved) : null;
};

// Enhanced network adapter creation based on templates
export const createDefaultAdapters = (deviceType: string): NetworkAdapter[] => {
  console.log("Creating default adapters for:", deviceType);
  
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
      return [createAdapter(1)];
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
  
  const changes = [
    {
      field: "Network Connection",
      oldValue: connected ? "Disconnected" : "Connected",
      newValue: connected ? "Connected" : "Disconnected"
    }
  ];

  logTransaction(
    connected ? "Connected" : "Disconnected",
    "networkAdapter",
    sourceDevice.name,
    changes,
    sourceDevice
  );

  return devices.map(device => {
    if (device.id === sourceDevice.id) {
      const updatedAdapters = device.networkAdapters.map(adapter =>
        adapter.id === adapterId ? {
          ...adapter,
          connected,
          connectedToDevice: connected ? targetDeviceId : undefined
        } : adapter
      );

      return { ...device, networkAdapters: updatedAdapters };
    }

    if (device.id === targetDeviceId) {
      const targetAdapter = device.networkAdapters.find(adapter => 
        adapter.connectedToDevice === sourceDevice.id
      ) || {
        id: crypto.randomUUID(),
        name: "Auto-created Connection",
        type: "ethernet",
        speed: "1Gbit",
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

      return { ...device, networkAdapters: updatedAdapters };
    }

    return device;
  });
};