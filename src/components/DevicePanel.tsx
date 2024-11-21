import { Device, NetworkAdapter, LogEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { X, Trash2, History, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import NetworkAdapters from "./NetworkAdapters";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { logTransaction, getDeviceLogs } from "@/lib/storage";
import { format } from "date-fns";

interface DevicePanelProps {
  device: Device;
  onClose: () => void;
  onUpdate: (device: Device) => void;
  onDelete?: (deviceId: string) => void;
  availableDevices: Device[];
}

const DevicePanel = ({ device, onClose, onUpdate, onDelete, availableDevices }: DevicePanelProps) => {
  const [currentDevice, setCurrentDevice] = useState(device);
  const [recentChanges, setRecentChanges] = useState<LogEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const ignoreClickOutside = useRef(false);

  useEffect(() => {
    setCurrentDevice(device);
    const logs = getDeviceLogs(device.id).slice(0, 3); // Get last 3 changes
    setRecentChanges(logs);
  }, [device]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreClickOutside.current) {
        ignoreClickOutside.current = false;
        return;
      }
      
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleStatusChange = (enabled: boolean) => {
    const newStatus = enabled ? 'active' as const : 'inactive' as const;
    const updatedDevice = { ...currentDevice, status: newStatus };
    setCurrentDevice(updatedDevice);
    onUpdate(updatedDevice);
    toast.success(`System ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleNetworkAdapterUpdate = (adapters: NetworkAdapter[]) => {
    ignoreClickOutside.current = true;
    const updatedDevice = { ...currentDevice, networkAdapters: adapters };
    setCurrentDevice(updatedDevice);
    onUpdate(updatedDevice);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(device.id);
      onClose();
      toast.success("Device deleted successfully");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    const name = prompt("Enter new device name:", currentDevice.name);
    if (name && name !== currentDevice.name) {
      const updatedDevice = { ...currentDevice, name };
      setCurrentDevice(updatedDevice);
      onUpdate(updatedDevice);
      logTransaction(
        "updated",
        "device",
        name,
        [{
          field: "name",
          oldValue: currentDevice.name,
          newValue: name
        }],
        currentDevice
      );
      toast.success("Device name updated successfully");
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l animate-slide-in overflow-y-auto z-50" ref={panelRef}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentDevice.name}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Device Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">System Status</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentDevice.status === 'active'}
                    onCheckedChange={handleStatusChange}
                  />
                  <span className={`font-medium ${
                    currentDevice.status === 'active' ? 'text-green-500' :
                    currentDevice.status === 'maintenance' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {currentDevice.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{currentDevice.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manufacturer</span>
                <span className="font-medium">{currentDevice.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium">{currentDevice.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height</span>
                <span className="font-medium">{currentDevice.height}U</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium">U{currentDevice.position}</span>
              </div>
              {currentDevice.assetReference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset Reference</span>
                  <span className="font-medium">{currentDevice.assetReference}</span>
                </div>
              )}
            </div>
          </div>

          <NetworkAdapters
            adapters={currentDevice.networkAdapters}
            onUpdate={handleNetworkAdapterUpdate}
            availableDevices={availableDevices}
            currentDevice={currentDevice}
          />

          {recentChanges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Changes
              </h3>
              <div className="space-y-3">
                {recentChanges.map((log) => (
                  <div key={log.id} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground">
                        {format(new Date(log.timestamp), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      {log.changes.map((change, idx) => (
                        <div key={idx} className="text-muted-foreground">
                          {change.field}: {change.oldValue} → {change.newValue}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePanel;