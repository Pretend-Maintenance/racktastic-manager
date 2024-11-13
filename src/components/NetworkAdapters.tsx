import { NetworkAdapter, Device } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Cable, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const toggleConnection = (id: string, targetDeviceId?: string) => {
    const newAdapters = adapters.map(adapter =>
      adapter.id === id
        ? { 
            ...adapter, 
            connected: !adapter.connected,
            connectedToDevice: !adapter.connected ? targetDeviceId : undefined
          }
        : adapter
    );
    onUpdate(newAdapters);
    
    const adapter = newAdapters.find(a => a.id === id);
    if (adapter) {
      const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
      toast.success(
        `Port ${adapter.port} ${adapter.connected ? 'connected' : 'disconnected'}` +
        (targetDevice ? ` ${adapter.connected ? 'to' : 'from'} ${targetDevice.name}` : '')
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Network Adapters</h3>
        <Button variant="outline" size="sm" onClick={() => toast.info("Add adapter coming soon!")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Adapter
        </Button>
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
                      → {availableDevices.find(d => d.id === adapter.connectedToDevice)?.name || 'Custom'}
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
                    onValueChange={(value) => toggleConnection(adapter.id, value)}
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