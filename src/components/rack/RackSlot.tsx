import { Device } from "@/lib/types";
import { Server, Network, Shield, Database } from "lucide-react";

interface RackSlotProps {
  position: number;
  device?: Device;
  onDrop: (position: number) => void;
  onSelectDevice: (device: Device) => void;
  isOccupied: boolean;
}

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "server":
      return <Server className="w-6 h-6" />;
    case "switch":
      return <Network className="w-6 h-6" />;
    case "firewall":
      return <Shield className="w-6 h-6" />;
    case "storage":
      return <Database className="w-6 h-6" />;
    default:
      return <Server className="w-6 h-6" />;
  }
};

export const RackSlot = ({ position, device, onDrop, onSelectDevice, isOccupied }: RackSlotProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    if (!isOccupied) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`h-12 border-t border-rack-rail relative ${
        device ? `bg-device-${device.type}` : "bg-rack-slot"
      }`}
      onDragOver={handleDragOver}
      onDrop={() => !isOccupied && onDrop(position)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-white">
        {position}
      </div>
      {device && position === device.position && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-opacity-90 text-white cursor-pointer"
          draggable
          onClick={() => onSelectDevice(device)}
        >
          <div className="flex items-center space-x-2">
            {getDeviceIcon(device.type)}
            <span>{device.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};