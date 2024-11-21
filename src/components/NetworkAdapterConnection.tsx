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
import { useState, useEffect } from "react";
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

    // If we're switching from one device to another, first disconnect from the old device
    if (adapter.connected && adapter.connectedToDevice && adapter.connectedToDevice !== targetDeviceId) {
      console.log("Disconnecting from previous device:", adapter.connectedToDevice);
      onToggleConnection(adapter.id);
    }

    const targetDevice = availableDevices.find(d => d.id === targetDeviceId);
    if (!targetDevice) return;

    // Find any free port on the target device
    const freePort = targetDevice.networkAdapters.find(a => !a.connected);
    
    if (freePort) {
      console.log("Found free port:", freePort.port, "on device:", targetDevice.name);
      setSelectedDevice(targetDeviceId);
      onToggleConnection(adapter.id, targetDeviceId);
      
      // Update both devices' states
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
      
      // Log the connection
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

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
            onClick={(e) => {
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
                // Prevent event propagation when opening the select
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
              e.stopPropagation();
              onRemoveAdapter(adapter.id);
            }}
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
              setSelectedDevice(adapter.connectedToDevice);
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