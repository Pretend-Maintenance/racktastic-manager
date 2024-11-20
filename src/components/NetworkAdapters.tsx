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

const NetworkAdapters = ({ 
  adapters, 
  onUpdate, 
  availableDevices = [], 
  currentDevice 
}: NetworkAdaptersProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customConnection, setCustomConnection] = useState("");

  const toggleConnection = (id: string, targetDeviceId?: string) => {
    if (!currentDevice) return;
    
    const adapter = adapters.find(a => a.id === id);
    if (!adapter) return;

    const targetDevice = targetDeviceId ? availableDevices.find(d => d.id === targetDeviceId) : undefined;
    
    const newAdapters = adapters.map(a =>
      a.id === id
        ? { 
            ...a, 
            connected: !a.connected,
            connectedToDevice: !a.connected ? targetDeviceId : undefined,
            customConnection: targetDeviceId === "custom" ? customConnection : undefined
          }
        : a
    );
    
    onUpdate(newAdapters);
    
    if (adapter && adapter.connected && targetDeviceId && targetDeviceId !== "custom") {
      if (targetDevice) {
        const existingConnection = targetDevice.networkAdapters.find(
          a => a.connectedToDevice === currentDevice.id
        );
        
        if (!existingConnection) {
          const nextFreePort = findNextFreePort(targetDevice.networkAdapters);
          const updatedAdapters = [...targetDevice.networkAdapters];
          
          if (nextFreePort) {
            // Update existing free port
            const freePortIndex = updatedAdapters.findIndex(a => a.port === nextFreePort);
            if (freePortIndex !== -1) {
              updatedAdapters[freePortIndex] = {
                ...updatedAdapters[freePortIndex],
                connected: true,
                connectedToDevice: currentDevice.id
              };
            }
          }
          
          const updateEvent = new CustomEvent('updateDeviceAdapters', {
            detail: {
              deviceId: targetDevice.id,
              adapters: updatedAdapters
            }
          });
          window.dispatchEvent(updateEvent);
          
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
    } else if (adapter) {
      logTransaction(
        "disconnected",
        "networkAdapter",
        `${adapter.name} (Port ${adapter.port})`,
        [{
          field: "Connection",
          oldValue: `Connected to ${targetDevice?.name || adapter.customConnection || 'unknown'}`,
          newValue: "Disconnected"
        }],
        currentDevice
      );
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