import { Device, NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import NetworkAdapters from "./NetworkAdapters";

interface DevicePanelProps {
  device: Device;
  onClose: () => void;
  onUpdate: (device: Device) => void;
}

const DevicePanel = ({ device, onClose, onUpdate }: DevicePanelProps) => {
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l animate-slide-in overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{device.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Device Information</h3>
            <div className="space-y-2">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  device.status === 'active' ? 'text-green-500' :
                  device.status === 'maintenance' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {device.status}
                </span>
              </div>
            </div>
          </div>

          <NetworkAdapters
            adapters={device.networkAdapters}
            onUpdate={(adapters) => onUpdate({ ...device, networkAdapters: adapters })}
          />
        </div>
      </div>
    </div>
  );
};

export default DevicePanel;