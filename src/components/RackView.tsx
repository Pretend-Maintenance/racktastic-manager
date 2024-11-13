import { useState } from "react";
import { Device, Rack } from "@/lib/types";
import { Server, Network, Shield, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RackViewProps {
  rack: Rack;
  onSelectDevice: (device: Device) => void;
  onUpdateRack: (rack: Rack) => void;
}

const RackView = ({ rack, onSelectDevice, onUpdateRack }: RackViewProps) => {
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);

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

  const handleDragStart = (device: Device) => {
    setDraggedDevice(device);
  };

  const handleDrop = (position: number) => {
    if (!draggedDevice) return;

    const newDevices = rack.devices.map(d => 
      d.id === draggedDevice.id 
        ? { ...d, position } 
        : d
    );

    onUpdateRack({ ...rack, devices: newDevices });
    setDraggedDevice(null);
    toast.success("Device moved successfully");
  };

  const renderSlots = () => {
    const slots = [];
    for (let i = rack.totalU; i > 0; i--) {
      const device = rack.devices.find(d => d.position <= i && i < d.position + d.height);
      
      slots.push(
        <div
          key={i}
          className={`h-12 border-t border-rack-rail relative ${
            device ? `bg-device-${device.type}` : "bg-rack-slot"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-white">
            {i}
          </div>
          {device && i === device.position && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-opacity-90 text-white cursor-pointer"
              draggable
              onDragStart={() => handleDragStart(device)}
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
    }
    return slots;
  };

  return (
    <div className="bg-rack-frame p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{rack.name}</h2>
        <Button variant="outline" size="sm" onClick={() => toast.info("Add device coming soon!")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>
      <div className="relative border-x-8 border-rack-rail">
        {renderSlots()}
      </div>
    </div>
  );
};

export default RackView;