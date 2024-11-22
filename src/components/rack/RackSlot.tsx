import { Device } from "@/lib/types";
import { Server, Network, Shield, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface RackSlotProps {
  position: number;
  device?: Device;
  onDrop: (position: number) => void;
  onSelectDevice: (device: Device) => void;
  isOccupied: boolean;
  onDragStart: (device: Device) => void;
}

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "server":
      return <Server className="w-5 h-5 flex-shrink-0" />;
    case "switch":
      return <Network className="w-5 h-5 flex-shrink-0" />;
    case "firewall":
      return <Shield className="w-5 h-5 flex-shrink-0" />;
    case "storage":
      return <Database className="w-5 h-5 flex-shrink-0" />;
    default:
      return <Server className="w-5 h-5 flex-shrink-0" />;
  }
};

export const RackSlot = ({ position, device, onDrop, onSelectDevice, isOccupied, onDragStart }: RackSlotProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    if (!isOccupied) {
      e.preventDefault();
    }
  };

  const handleDragStart = (e: React.DragEvent, device: Device) => {
    console.log("Starting drag for device:", device.name);
    onDragStart(device);
  };

  return (
    <div
      className={cn(
        "h-12 border-t border-rack-rail relative",
        device ? `bg-device-${device.type}` : "bg-rack-slot"
      )}
      onDragOver={handleDragOver}
      onDrop={() => !isOccupied && onDrop(position)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-white text-sm font-medium">
        {position}
      </div>
      {device && position === device.position && (
        <div
          className="absolute inset-0 flex items-center pl-10 pr-2 bg-opacity-90 text-white cursor-pointer overflow-hidden"
          draggable
          onDragStart={(e) => handleDragStart(e, device)}
          onClick={() => onSelectDevice(device)}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {getDeviceIcon(device.type)}
            <span className="truncate text-sm">{device.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};