import { NetworkAdapter, Device } from "../types";
import { logTransaction } from "./logs";

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