import { useState, useEffect } from 'react';
import { NetworkAdapter, Device } from "@/lib/types";
import { logTransaction } from "@/lib/storage";
import { findNextFreePort } from "../network-adapters/portUtils";

export const useAdapterConnection = (
  adapter: NetworkAdapter,
  onToggleConnection: (id: string, targetDeviceId?: string) => void,
  availableDevices: Device[],
  setCustomConnection: (value: string) => void,
  currentDevice?: Device
) => {
  const [showCreatePortDialog, setShowCreatePortDialog] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | undefined>();
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(adapter.connectedToDevice);

  useEffect(() => {
    setSelectedDevice(adapter.connectedToDevice);
  }, [adapter.connectedToDevice]);

  const handleConnectionAttempt = (targetDeviceId: string) => {
    console.log("Attempting connection to device:", targetDeviceId);
    
    if (targetDeviceId === "custom") {
      const connection = window.prompt("Enter custom connection details:");
      if (connection) {
        setCustomConnection(connection);
        onToggleConnection(adapter.id, "custom");
      }
      return;
    }

    // First disconnect if already connected
    if (adapter.connected) {
      console.log("Disconnecting current connection before making new one");
      onToggleConnection(adapter.id);
    }

    const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
    if (!targetDevice) {
      console.error("Target device not found:", targetDeviceId);
      return;
    }

    console.log("Current device:", currentDevice?.name);
    console.log("Target device:", targetDevice.name);
    console.log("Source adapter:", adapter);
    console.log("Target device adapters:", targetDevice.networkAdapters);

    // Find next available port on target device
    const nextFreePort = findNextFreePort(targetDevice.networkAdapters);
    console.log("Next free port on target device:", nextFreePort);

    if (nextFreePort) {
      console.log("Found free port:", nextFreePort, "on device:", targetDevice.name);
      
      // Find the adapter that corresponds to the free port
      const targetAdapter = targetDevice.networkAdapters.find(a => a.port === nextFreePort);
      
      if (targetAdapter) {
        console.log("Found target adapter:", targetAdapter);
        
        // Update the connection
        setSelectedDevice(targetDeviceId);
        onToggleConnection(adapter.id, targetDeviceId);

        // Update the target device's adapter
        const updateEvent = new CustomEvent('updateDeviceAdapters', {
          detail: {
            deviceId: targetDevice.id,
            adapters: targetDevice.networkAdapters.map(a =>
              a.id === targetAdapter.id
                ? { ...a, connected: true, connectedToDevice: currentDevice?.id }
                : a
            )
          }
        });
        window.dispatchEvent(updateEvent);

        if (currentDevice) {
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
        }
      }
    } else {
      console.log("No free ports available on target device:", targetDevice.name);
      setPendingConnection(targetDeviceId);
      setShowCreatePortDialog(true);
    }
  };

  return {
    showCreatePortDialog,
    setShowCreatePortDialog,
    pendingConnection,
    setPendingConnection,
    selectedDevice,
    setSelectedDevice,
    handleConnectionAttempt
  };
};