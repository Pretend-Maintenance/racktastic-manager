import { Device, NetworkAdapter } from "@/lib/types";
import { findNextFreePort } from "./portUtils";
import { toast } from "sonner";
import { logTransaction } from "@/lib/storage";

interface ConnectionManagerProps {
  adapter: NetworkAdapter;
  currentDevice?: Device;
  targetDeviceId: string;
  onUpdate: (adapters: NetworkAdapter[]) => void;
  adapters: NetworkAdapter[];
  availableDevices: Device[];
}

export const handleConnection = ({
  adapter,
  currentDevice,
  targetDeviceId,
  onUpdate,
  adapters,
  availableDevices
}: ConnectionManagerProps) => {
  console.log("Connection manager handling connection:", {
    sourceDevice: currentDevice?.name,
    sourceAdapter: adapter.name,
    targetDeviceId
  });

  // Handle custom connections
  if (targetDeviceId === "custom") {
    const connection = window.prompt("Enter custom connection details:");
    if (connection) {
      const updatedAdapters = adapters.map(a =>
        a.id === adapter.id ? {
          ...a,
          connected: true,
          connectedToDevice: "custom",
          customConnection: connection
        } : a
      );
      onUpdate(updatedAdapters);
    }
    return;
  }

  // Find target device
  const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
  if (!targetDevice || !currentDevice) {
    console.error("Target device or current device not found");
    return;
  }

  console.log("Found target device:", targetDevice.name);
  const nextFreePort = findNextFreePort(targetDevice.networkAdapters);

  if (nextFreePort) {
    console.log("Found free port on target device:", nextFreePort);

    // Update source adapter
    const updatedAdapters = adapters.map(a =>
      a.id === adapter.id ? {
        ...a,
        connected: true,
        connectedToDevice: targetDeviceId
      } : a
    );
    onUpdate(updatedAdapters);

    // Find target adapter
    const targetAdapter = targetDevice.networkAdapters.find(a => a.port === nextFreePort);
    if (targetAdapter) {
      // Update target device
      const updateEvent = new CustomEvent("updateDeviceAdapters", {
        detail: {
          deviceId: targetDevice.id,
          adapters: targetDevice.networkAdapters.map(a =>
            a.id === targetAdapter.id ? {
              ...a,
              connected: true,
              connectedToDevice: currentDevice.id
            } : a
          )
        }
      });
      window.dispatchEvent(updateEvent);

      // Log the connection
      logTransaction(
        "connected",
        "networkAdapter",
        `${adapter.name} (Port ${adapter.port})`,
        [{
          field: "Connection",
          oldValue: "Disconnected",
          newValue: `Connected to ${targetDevice.name} (Port ${nextFreePort})`
        }],
        currentDevice
      );

      console.log("Connection established between devices");
    }
  } else {
    console.log("No free ports available on target device");
    toast.error("No free ports available on target device");
  }
};