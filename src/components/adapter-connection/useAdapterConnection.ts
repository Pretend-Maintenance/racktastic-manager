import { useState, useEffect } from 'react';
import { NetworkAdapter, Device } from "@/lib/types";
import { logTransaction } from "@/lib/storage";
import { findNextFreePort, findAdapterByPort } from "../network-adapters/portUtils";

/**
 * Custom hook to manage the connection state of a network adapter.
 * Handles connection attempts, disconnections, and UI interactions.
 */
export const useAdapterConnection = (
  adapter: NetworkAdapter, // Current network adapter
  onToggleConnection: (id: string, targetDeviceId?: string) => void, // Callback to toggle connection state
  availableDevices: Device[], // List of devices available for connection
  setCustomConnection: (value: string) => void, // Callback for setting custom connection details
  currentDevice?: Device // Device to which the current adapter belongs
) => {
  const [showCreatePortDialog, setShowCreatePortDialog] = useState(false); // Show dialog to create new ports
  const [pendingConnection, setPendingConnection] = useState<string | undefined>(); // Pending device connection ID
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(adapter.connectedToDevice); // Currently selected device for connection

  // Synchronize the selected device state when the adapter's connection changes
  useEffect(() => {
    setSelectedDevice(adapter.connectedToDevice);
  }, [adapter.connectedToDevice]);

  /**
   * Handles connection attempts to a target device or custom configuration.
   * @param targetDeviceId ID of the target device to connect to
   */
  const handleConnectionAttempt = (targetDeviceId: string) => {
    console.log("Attempting connection to device:", targetDeviceId);

    if (targetDeviceId === "custom") {
      // Handle custom connection input
      const connection = window.prompt("Enter custom connection details:");
      if (connection) {
        setCustomConnection(connection);
        onToggleConnection(adapter.id, "custom");
      }
      return;
    }

    // Disconnect the current connection if already connected
    if (adapter.connected) {
      console.log("Disconnecting current connection before making new one");
      onToggleConnection(adapter.id);
    }

    // Find the target device from the list of available devices
    const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
    if (!targetDevice) {
      console.error("Target device not found:", targetDeviceId);
      return;
    }

    console.log("Current device:", currentDevice?.name);
    console.log("Target device:", targetDevice.name);
    console.log("Source adapter:", adapter);
    console.log("Target device adapters:", targetDevice.networkAdapters);

    // Find the next free port on the target device
    const nextFreePort = findNextFreePort(targetDevice.networkAdapters);
    console.log("Next free port on target device:", nextFreePort);

    if (nextFreePort) {
      // Locate the adapter corresponding to the free port
      const targetAdapter = findAdapterByPort(targetDevice.networkAdapters, nextFreePort);

      if (targetAdapter) {
        console.log("Found target adapter:", targetAdapter);

        // Update connection states for both devices
        setSelectedDevice(targetDeviceId);
        onToggleConnection(adapter.id, targetDeviceId);

        // Dispatch an event to update the target device's network adapters
        const updatedAdapters = targetDevice.networkAdapters.map(a =>
          a.id === targetAdapter.id
            ? {
                ...a,
                connected: true,
                connectedToDevice: currentDevice?.id,
                port: nextFreePort, // Explicitly set the port
              }
            : a
        );

        const updateEvent = new CustomEvent("updateDeviceAdapters", {
          detail: {
            deviceId: targetDevice.id,
            adapters: updatedAdapters,
          },
        });
        window.dispatchEvent(updateEvent);

        // Log the connection transaction
        if (currentDevice) {
          logTransaction(
            "connected",
            "networkAdapter",
            `${adapter.name} (Port ${adapter.port})`,
            [
              {
                field: "Connection",
                oldValue: "Disconnected",
                newValue: `Connected to ${targetDevice.name} (Port ${nextFreePort})`,
              },
            ],
            currentDevice
          );
        }
      }
    } else {
      console.log("No free ports available on target device:", targetDevice.name);
      // Prompt the user to create a new port if none are available
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
    handleConnectionAttempt,
  };
};
