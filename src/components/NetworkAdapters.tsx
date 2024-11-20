import { NetworkAdapter, Device } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NetworkAdapterForm } from "./NetworkAdapterForm";
import { NetworkAdapterConnection } from "./NetworkAdapterConnection";
import { useState } from "react";
import { logTransaction } from "@/lib/storage";
import { findNextFreePort } from "./network-adapters/portUtils";

// Split into smaller components for better maintainability
import { AdapterList } from "./network-adapters/AdapterList";
import { AdapterHeader } from "./network-adapters/AdapterHeader";

interface NetworkAdaptersProps {
  adapters: NetworkAdapter[];
  onUpdate: (adapters: NetworkAdapter[]) => void;
  availableDevices?: Device[];
  currentDevice?: Device;
}

const NetworkAdapters = ({ 
  adapters, 
  onUpdate, 
  availableDevices = [], 
  currentDevice 
}: NetworkAdaptersProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customConnection, setCustomConnection] = useState("");

  const handleAddAdapter = (adapter: Omit<NetworkAdapter, "id">) => {
    const newAdapter: NetworkAdapter = {
      ...adapter,
      id: crypto.randomUUID(),
      port: String(adapters.length + 1)
    };

    const updatedAdapters = [...adapters, newAdapter];
    onUpdate(updatedAdapters);

    if (currentDevice) {
      logTransaction(
        "created",
        "networkAdapter",
        newAdapter.name,
        [{
          field: "Network Adapter",
          oldValue: "",
          newValue: `${newAdapter.name} (${newAdapter.type})`
        }],
        currentDevice
      );
    }

    toast.success("Network adapter added successfully");
  };

  const handleRemoveAdapter = (id: string) => {
    const adapter = adapters.find(a => a.id === id);
    if (!adapter) return;

    // If the adapter is connected, we need to disconnect it from the target device
    if (adapter.connected && adapter.connectedToDevice) {
      const targetDevice = availableDevices?.find(d => d.id === adapter.connectedToDevice);
      if (targetDevice) {
        const updateEvent = new CustomEvent('updateDeviceAdapters', {
          detail: {
            deviceId: targetDevice.id,
            adapters: targetDevice.networkAdapters.map(a => 
              a.connectedToDevice === currentDevice?.id 
                ? { ...a, connected: false, connectedToDevice: undefined }
                : a
            )
          }
        });
        window.dispatchEvent(updateEvent);
      }
    }

    const updatedAdapters = adapters.filter(a => a.id !== id);
    onUpdate(updatedAdapters);

    if (currentDevice) {
      logTransaction(
        "deleted",
        "networkAdapter",
        adapter.name,
        [{
          field: "Network Adapter",
          oldValue: `${adapter.name} (${adapter.type})`,
          newValue: ""
        }],
        currentDevice
      );
    }

    toast.success("Network adapter removed successfully");
  };

  const toggleConnection = (id: string, targetDeviceId?: string) => {
    if (!currentDevice) return;
    
    const adapter = adapters.find(a => a.id === id);
    if (!adapter) return;

    console.log("Toggling connection:", { 
      sourceDevice: currentDevice.name, 
      sourceAdapter: adapter.name,
      targetDeviceId 
    });

    const targetDevice = targetDeviceId ? availableDevices.find(d => d.id === targetDeviceId) : undefined;
    
    // If we're disconnecting
    if (adapter.connected) {
      console.log("Disconnecting devices");
      
      // Update source adapter
      const newAdapters = adapters.map(a =>
        a.id === id ? { ...a, connected: false, connectedToDevice: undefined } : a
      );
      onUpdate(newAdapters);

      // Update target device if it exists
      if (adapter.connectedToDevice && adapter.connectedToDevice !== "custom") {
        const targetDevice = availableDevices.find(d => d.id === adapter.connectedToDevice);
        if (targetDevice) {
          console.log("Updating target device:", targetDevice.name);
          const updateEvent = new CustomEvent('updateDeviceAdapters', {
            detail: {
              deviceId: targetDevice.id,
              adapters: targetDevice.networkAdapters.map(a => 
                a.connectedToDevice === currentDevice.id 
                  ? { ...a, connected: false, connectedToDevice: undefined }
                  : a
              )
            }
          });
          window.dispatchEvent(updateEvent);
        }
      }
    } 
    // If we're connecting
    else if (targetDeviceId) {
      console.log("Connecting devices");
      
      // Handle custom connections
      if (targetDeviceId === "custom") {
        const newAdapters = adapters.map(a =>
          a.id === id ? { 
            ...a, 
            connected: true,
            connectedToDevice: "custom",
            customConnection: customConnection 
          } : a
        );
        onUpdate(newAdapters);
        return;
      }

      // Handle device-to-device connections
      if (targetDevice) {
        console.log("Found target device:", targetDevice.name);
        const nextFreePort = findNextFreePort(targetDevice.networkAdapters);
        
        if (nextFreePort) {
          console.log("Found free port on target device:", nextFreePort);
          
          // Update source adapter
          const newAdapters = adapters.map(a =>
            a.id === id ? { 
              ...a, 
              connected: true,
              connectedToDevice: targetDeviceId 
            } : a
          );
          onUpdate(newAdapters);

          // Update target device
          const updateEvent = new CustomEvent('updateDeviceAdapters', {
            detail: {
              deviceId: targetDevice.id,
              adapters: targetDevice.networkAdapters.map(a =>
                a.port === nextFreePort ? {
                  ...a,
                  connected: true,
                  connectedToDevice: currentDevice.id
                } : a
              )
            }
          });
          window.dispatchEvent(updateEvent);

          console.log("Connection established between devices");
        } else {
          console.log("No free ports available on target device");
          toast.error("No free ports available on target device");
        }
      }
    }
  };

  return (
    <div>
      <AdapterHeader onOpenDialog={() => setIsDialogOpen(true)} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Network Adapter</DialogTitle>
          </DialogHeader>
          <NetworkAdapterForm 
            onAdd={handleAddAdapter} 
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AdapterList 
        adapters={adapters}
        onToggleConnection={toggleConnection}
        onRemoveAdapter={handleRemoveAdapter}
        availableDevices={availableDevices}
        currentDevice={currentDevice}
        customConnection={customConnection}
        setCustomConnection={setCustomConnection}
      />
    </div>
  );
};

export default NetworkAdapters;