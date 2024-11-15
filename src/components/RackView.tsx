import { useState } from "react";
import { Device, Rack } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RackSlot } from "./rack/RackSlot";
import { RackHeader } from "./rack/RackHeader";
import { isSlotAvailable } from "@/lib/rackUtils";

interface RackViewProps {
  rack: Rack;
  onSelectDevice: (device: Device) => void;
  onUpdateRack: (rack: Rack) => void;
  onDeleteRack: (rackId: string) => void;
}

const RackView = ({ rack, onSelectDevice, onUpdateRack, onDeleteRack }: RackViewProps) => {
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);

  const handleDrop = (position: number) => {
    if (!draggedDevice) return;

    // Check if there's enough space for the device
    const canFit = isSlotAvailable(rack, position, draggedDevice.height, draggedDevice.id);
    
    if (!canFit) {
      toast.error("Cannot place device here - insufficient space or overlap with other devices");
      return;
    }

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
      const isOccupied = rack.devices.some(d => 
        d.position <= i && i < d.position + d.height
      );
      
      slots.push(
        <RackSlot
          key={i}
          position={i}
          device={device}
          onDrop={handleDrop}
          onSelectDevice={onSelectDevice}
          isOccupied={isOccupied}
        />
      );
    }
    return slots;
  };

  return (
    <div className="bg-rack-frame p-4 rounded-lg">
      <RackHeader 
        rack={rack}
        onUpdateRack={onUpdateRack}
        onDeleteRack={onDeleteRack}
      />
      <div className="relative border-x-8 border-rack-rail mt-4">
        {renderSlots()}
      </div>
    </div>
  );
};

export default RackView;