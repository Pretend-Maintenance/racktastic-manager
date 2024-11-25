import { Device, NetworkAdapter, LogEntry } from "@/lib/types";
import NetworkAdapters from "./NetworkAdapters";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { logTransaction, getDeviceLogs } from "@/lib/storage";

import { DeviceInfo } from "./device-panel/DeviceInfo";
import { DeviceHeader } from "./device-panel/DeviceHeader";
import { RecentChanges } from "./device-panel/RecentChanges";
import { EditDeviceForm } from "./device-panel/EditDeviceForm";

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
  };

  const handleSaveEdit = (updatedDevice: Device) => {
    setCurrentDevice(updatedDevice);
    onUpdate(updatedDevice);
    setIsEditing(false);
    logTransaction(
      "updated",
      "device",
      updatedDevice.name,
      [{
        field: "device",
        oldValue: JSON.stringify(currentDevice),
        newValue: JSON.stringify(updatedDevice)
      }],
      updatedDevice
    );
    toast.success("Device updated successfully");
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
          {isEditing ? (
            <EditDeviceForm
              device={currentDevice}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePanel;