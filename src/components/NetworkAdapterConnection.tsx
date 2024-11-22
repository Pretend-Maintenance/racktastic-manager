import { NetworkAdapter, Device } from "@/lib/types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Cable, Trash2 } from "lucide-react";
import { AlertDialogContent } from "./adapter-connection/AlertDialogContent";
import { useAdapterConnection } from "./adapter-connection/useAdapterConnection";

interface NetworkAdapterConnectionProps {
  adapter: NetworkAdapter;
  onToggleConnection: (id: string, targetDeviceId?: string) => void;
  onRemoveAdapter: (id: string) => void;
  availableDevices: Device[];
  currentDevice?: Device;
  customConnection: string;
  setCustomConnection: (value: string) => void;
}

export const NetworkAdapterConnection = ({
  adapter,
  onToggleConnection,
  onRemoveAdapter,
  availableDevices,
  currentDevice,
  customConnection,
  setCustomConnection
}: NetworkAdapterConnectionProps) => {
  const {
    showCreatePortDialog,
    setShowCreatePortDialog,
    pendingConnection,
    setPendingConnection,
    selectedDevice,
    setSelectedDevice,
    handleConnectionAttempt
  } = useAdapterConnection(
    adapter,
    onToggleConnection,
    availableDevices,
    setCustomConnection,
    currentDevice
  );

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getConnectedDeviceName = () => {
    if (!adapter.connected) return null;
    
    if (adapter.customConnection) {
      return adapter.customConnection;
    }

    if (adapter.connectedToDevice) {
      const device = availableDevices.find(d => d.id === adapter.connectedToDevice);
      return device?.name || 'Unknown Device';
    }

    return null;
  };

  const connectedDeviceName = getConnectedDeviceName();

  return (
    <div className="flex items-center space-x-2" onClick={handleSelectClick}>
      {adapter.connected ? (
        <div className="flex items-center space-x-2">
          {connectedDeviceName && (
            <span className="text-sm text-muted-foreground">
              → {connectedDeviceName}
            </span>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleConnection(adapter.id);
              setSelectedDevice(undefined);
            }}
          >
            <Cable className="w-4 h-4 text-white" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Select 
            value={selectedDevice} 
            onValueChange={handleConnectionAttempt}
            onOpenChange={(open) => {
              if (open) {
                event?.preventDefault();
                event?.stopPropagation();
              }
            }}
          >
            <SelectTrigger className="w-[180px]" onClick={handleSelectClick}>
              <SelectValue placeholder="Connect to..." />
            </SelectTrigger>
            <SelectContent onClick={handleSelectClick}>
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveAdapter(adapter.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <AlertDialogContent 
        showDialog={showCreatePortDialog}
        setShowDialog={setShowCreatePortDialog}
        pendingConnection={pendingConnection}
        setPendingConnection={setPendingConnection}
        adapter={adapter}
        onToggleConnection={onToggleConnection}
        setSelectedDevice={setSelectedDevice}
      />
    </div>
  );
};