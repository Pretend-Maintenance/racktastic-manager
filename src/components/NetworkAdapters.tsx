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

  const createDefaultAdapter = (deviceId: string): NetworkAdapter => ({
    id: crypto.randomUUID(),
    name: "Auto-created Port",
    type: currentDevice?.type === "storage" ? "fiber" : "ethernet",
    speed: currentDevice?.type === "storage" ? "10Gbit" : "1Gbit",
    port: String(Math.max(...adapters.map(a => parseInt(a.port) || 0), 0) + 1),
    connected: true,
    connectedToDevice: deviceId
  });

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
        const hasConnectedAdapter = targetDevice.networkAdapters.some(
          a => a.connectedToDevice === currentDevice.id
        );
        
        if (!hasConnectedAdapter) {
          const newTargetAdapter = createDefaultAdapter(currentDevice.id);
          const updatedAdapters = [...targetDevice.networkAdapters, newTargetAdapter];
          
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
              newValue: `Connected to ${targetDevice.name} (Port ${newTargetAdapter.port})`
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

  const handleAddAdapter = (newAdapter: Omit<NetworkAdapter, "id">) => {
    const adapter: NetworkAdapter = {
      ...newAdapter,
      id: crypto.randomUUID(),
    };
    onUpdate([...adapters, adapter]);
    
    logTransaction(
      "created",
      "networkAdapter",
      adapter.name,
      [{
        field: "Port",
        oldValue: "",
        newValue: adapter.port
      }, {
        field: "Type",
        oldValue: "",
        newValue: adapter.type
      }, {
        field: "Speed",
        oldValue: "",
        newValue: adapter.speed
      }],
      currentDevice
    );
    
    toast.success("Network adapter added successfully");
  };

  const handleRemoveAdapter = (id: string) => {
    const adapter = adapters.find(a => a.id === id);
    if (adapter) {
      logTransaction(
        "deleted",
        "networkAdapter",
        adapter.name,
        [{
          field: "Port",
          oldValue: adapter.port,
          newValue: ""
        }],
        currentDevice
      );
    }
    
    onUpdate(adapters.filter(a => a.id !== id));
    toast.success("Network adapter removed");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Network Adapters</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Adapter
            </Button>
          </DialogTrigger>
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
      </div>
      
      <div className="space-y-3">
        {adapters.map((adapter) => (
          <div
            key={adapter.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="space-y-1">
              <div className="font-medium">{adapter.name}</div>
              <div className="text-sm text-muted-foreground">
                {adapter.type} - {adapter.speed}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Port {adapter.port}</span>
              <NetworkAdapterConnection
                adapter={adapter}
                onToggleConnection={toggleConnection}
                onRemoveAdapter={handleRemoveAdapter}
                availableDevices={availableDevices}
                currentDevice={currentDevice}
                customConnection={customConnection}
                setCustomConnection={setCustomConnection}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkAdapters;