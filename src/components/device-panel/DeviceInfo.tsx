import { Device } from "@/lib/types";
import { Switch } from "@/components/ui/switch";

interface DeviceInfoProps {
  device: Device;
  onStatusChange: (enabled: boolean) => void;
}

export const DeviceInfo = ({ device, onStatusChange }: DeviceInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Device Information</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">System Status</span>
          <div className="flex items-center space-x-2">
            <Switch
              checked={device.status === 'active'}
              onCheckedChange={onStatusChange}
            />
            <span className={`font-medium ${
              device.status === 'active' ? 'text-green-500' :
              device.status === 'maintenance' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {device.status}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium">{device.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Manufacturer</span>
          <span className="font-medium">{device.manufacturer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{device.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Height</span>
          <span className="font-medium">{device.height}U</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Position</span>
          <span className="font-medium">U{device.position}</span>
        </div>
        {device.ipAddress && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address</span>
            <span className="font-medium">{device.ipAddress}</span>
          </div>
        )}
        {device.macAddress && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">MAC Address</span>
            <span className="font-medium">{device.macAddress}</span>
          </div>
        )}
        {device.assetReference && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Asset Reference</span>
            <span className="font-medium">{device.assetReference}</span>
          </div>
        )}
      </div>
    </div>
  );
};