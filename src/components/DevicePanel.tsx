import { Device, NetworkAdapter, LogEntry } from "@/lib/types";
import NetworkAdapters from "./NetworkAdapters";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { logTransaction, getDeviceLogs } from "@/lib/storage";

// Split into smaller components for better maintainability
import { DeviceInfo } from "./device-panel/DeviceInfo";
import { DeviceHeader } from "./device-panel/DeviceHeader";
import { RecentChanges } from "./device-panel/RecentChanges";

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
  const ignoreClickOutside = useRef(false);

  useEffect(() => {
    setCurrentDevice(device);
    const logs = getDeviceLogs(device.id).slice(0, 3);
    setRecentChanges(logs);
  }, [device]);

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
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l animate-slide-in overflow-y-auto z-50">
      <div className="p-6">
        <DeviceHeader 
          deviceName={currentDevice.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={onClose}
        />

        <div className="space-y-6">
          <DeviceInfo 
            device={currentDevice}
            onStatusChange={handleStatusChange}
          />

          <NetworkAdapters
            adapters={currentDevice.networkAdapters}
            onUpdate={handleNetworkAdapterUpdate}
            availableDevices={availableDevices}
            currentDevice={currentDevice}
          />

          {recentChanges.length > 0 && (
            <RecentChanges changes={recentChanges} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePanel;