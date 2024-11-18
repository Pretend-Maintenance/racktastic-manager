import { NetworkAdapter, Device } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Cable, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NetworkAdapterForm } from "./NetworkAdapterForm";
import { useState } from "react";

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
    type: "ethernet",
    speed: "1Gbit",
    port: String(Math.max(...adapters.map(a => parseInt(a.port) || 0), 0) + 1),
    connected: true,
    connectedToDevice: deviceId
  });

  const toggleConnection = (id: string, targetDeviceId?: string) => {
    if (!currentDevice) return;
    
    const newAdapters = adapters.map(adapter =>
      adapter.id === id
        ? { 
            ...adapter, 
            connected: !adapter.connected,
            connectedToDevice: !adapter.connected ? targetDeviceId : undefined,
            customConnection: targetDeviceId === "custom" ? customConnection : undefined
          }
        : adapter
    );
    
    onUpdate(newAdapters);
    
    const adapter = newAdapters.find(a => a.id === id);
    if (adapter && adapter.connected && targetDeviceId && targetDeviceId !== "custom") {
      // Find target device and ensure it has a connected adapter
      const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
      if (targetDevice) {
        const hasConnectedAdapter = targetDevice.networkAdapters.some(
          a => a.connectedToDevice === currentDevice.id
        );
        
        if (!hasConnectedAdapter) {
          // Create new adapter for target device
          const newTargetAdapter = createDefaultAdapter(currentDevice.id);
          const updatedAdapters = [...targetDevice.networkAdapters, newTargetAdapter];
          
          // Dispatch event to update target device
          const updateEvent = new CustomEvent('updateDeviceAdapters', {
            detail: {
              deviceId: targetDevice.id,
              adapters: updatedAdapters
            }
          });
          window.dispatchEvent(updateEvent);
          
          toast.success(
            `Created new network adapter on ${targetDevice.name} and connected to ${currentDevice.name}`
          );
        }
      }
    }
    
    if (adapter) {
      const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
      toast.success(
        `Port ${adapter.port} ${adapter.connected ? 'connected' : 'disconnected'}` +
        (targetDevice ? ` ${adapter.connected ? 'to' : 'from'} ${targetDevice.name}` : '') +
        (adapter.customConnection ? ` to ${adapter.customConnection}` : '')
      );
    }
  };

  const handleAddAdapter = (newAdapter: Omit<NetworkAdapter, "id">) => {
    const adapter: NetworkAdapter = {
      ...newAdapter,
      id: crypto.randomUUID(),
    };
    onUpdate([...adapters, adapter]);
    toast.success("Network adapter added successfully");
  };

  const handleRemoveAdapter = (id: string) => {
    onUpdate(adapters.filter(adapter => adapter.id !== id));
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
              {adapter.connected ? (
                <div className="flex items-center space-x-2">
                  {adapter.connectedToDevice && (
                    <span className="text-sm text-muted-foreground">
                      → {adapter.customConnection || availableDevices.find(d => d.id === adapter.connectedToDevice)?.name || 'Custom'}
                    </span>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => toggleConnection(adapter.id)}
                  >
                    <Cable className="w-4 h-4 text-white" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) => {
                      if (value === "custom") {
                        const connection = window.prompt("Enter custom connection details:");
                        if (connection) {
                          setCustomConnection(connection);
                          toggleConnection(adapter.id, "custom");
                        }
                      } else {
                        toggleConnection(adapter.id, value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Connect to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDevices
                        .filter(device => device.id !== currentDevice?.id)
                        .map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      <SelectItem value="custom">Custom Connection</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAdapter(adapter.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkAdapters;