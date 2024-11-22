import { useState, useEffect } from 'react';
import { NetworkAdapter, Device } from "@/lib/types";
import { logTransaction } from "@/lib/storage";

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

    // Check for existing connection from target device to current device
    const existingConnection = targetDevice.networkAdapters.find(
      a => a.connectedToDevice === currentDevice?.id
    );

    if (existingConnection) {
      console.log("Found existing connection on target device:", existingConnection);
      setSelectedDevice(targetDeviceId);
      onToggleConnection(adapter.id, targetDeviceId);
      return;
    }

    // Look for any free port
    const freePort = targetDevice.networkAdapters.find(a => !a.connected);
    
    if (freePort) {
      console.log("Found free port:", freePort.port, "on device:", targetDevice.name);
      setSelectedDevice(targetDeviceId);
      onToggleConnection(adapter.id, targetDeviceId);
      
      const updateEvent = new CustomEvent('updateDeviceAdapters', {
        detail: {
          deviceId: targetDevice.id,
          adapters: targetDevice.networkAdapters.map(a =>
            a.id === freePort.id
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
            newValue: `Connected to ${targetDevice.name} (Port ${freePort.port})`
          }],
          currentDevice
        );
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