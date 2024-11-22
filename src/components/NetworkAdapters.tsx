import { NetworkAdapter, Device } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NetworkAdapterForm } from "./NetworkAdapterForm";
import { logTransaction } from "@/lib/storage";
import { AdapterHeader } from "./network-adapters/AdapterHeader";
import { NetworkAdapterList } from "./network-adapters/NetworkAdapterList";
import { handleConnection } from "./network-adapters/ConnectionManager";

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
    const adapter = adapters.find(a => a.id === id);
    if (!adapter) return;

    if (adapter.connected) {
      // Disconnect
      const updatedAdapters = adapters.map(a =>
        a.id === id ? { ...a, connected: false, connectedToDevice: undefined } : a
      );
      onUpdate(updatedAdapters);

      // Update target device if it exists
      if (adapter.connectedToDevice && adapter.connectedToDevice !== "custom") {
        const targetDevice = availableDevices.find(d => d.id === adapter.connectedToDevice);
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
    } else if (targetDeviceId) {
      // Connect
      handleConnection({
        adapter,
        currentDevice,
        targetDeviceId,
        onUpdate,
        adapters,
        availableDevices
      });
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
      
      <NetworkAdapterList 
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