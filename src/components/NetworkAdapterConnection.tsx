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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { logTransaction } from "@/lib/storage";

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
  const [showCreatePortDialog, setShowCreatePortDialog] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | undefined>();

  const handleConnectionAttempt = (targetDeviceId: string) => {
    if (targetDeviceId === "custom") {
      const connection = window.prompt("Enter custom connection details:");
      if (connection) {
        setCustomConnection(connection);
        onToggleConnection(adapter.id, "custom");
      }
      return;
    }

    const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
    if (!targetDevice) return;

    // Find a free port on the target device
    const freePort = targetDevice.networkAdapters.find(a => !a.connected);
    
    if (freePort) {
      onToggleConnection(adapter.id, targetDeviceId);
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
    } else {
      setPendingConnection(targetDeviceId);
      setShowCreatePortDialog(true);
    }
  };

  return (
    <div className="flex items-center space-x-2">
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
            onClick={() => onToggleConnection(adapter.id)}
          >
            <Cable className="w-4 h-4 text-white" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Select onValueChange={handleConnectionAttempt}>
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
            onClick={() => onRemoveAdapter(adapter.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <AlertDialog open={showCreatePortDialog} onOpenChange={setShowCreatePortDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Free Ports Available</AlertDialogTitle>
            <AlertDialogDescription>
              There are no free ports on this device. Would you like to create one and connect the devices?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCreatePortDialog(false);
              setPendingConnection(undefined);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingConnection) {
                onToggleConnection(adapter.id, pendingConnection);
                setShowCreatePortDialog(false);
                setPendingConnection(undefined);
              }
            }}>
              Create Port and Connect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};