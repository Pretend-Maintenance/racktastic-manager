import { useState } from "react";
import { Device, Rack, DeviceType } from "@/lib/types";
import { Server, Network, Shield, Database, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddDeviceDialog } from "./dialogs/AddDeviceDialog";

interface RackViewProps {
  rack: Rack;
  onSelectDevice: (device: Device) => void;
  onUpdateRack: (rack: Rack) => void;
  onDeleteRack: (rackId: string) => void;
}

const RackView = ({ rack, onSelectDevice, onUpdateRack, onDeleteRack }: RackViewProps) => {
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);
  const [isEditingRack, setIsEditingRack] = useState(false);
  const [editedRack, setEditedRack] = useState(rack);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleUpdateRack = () => {
    onUpdateRack(editedRack);
    setIsEditingRack(false);
    toast.success("Rack updated successfully");
  };

  const handleDeleteRack = () => {
    onDeleteRack(rack.id);
    setShowDeleteConfirm(false);
    toast.success("Rack deleted successfully");
  };

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
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">{rack.name}</h2>
            <p className="text-sm text-gray-300">Location: {rack.location}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditingRack} onOpenChange={setIsEditingRack}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Rack
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Rack</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Rack Name</Label>
                    <Input
                      id="name"
                      value={editedRack.name}
                      onChange={(e) => setEditedRack({ ...editedRack, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedRack.location}
                      onChange={(e) => setEditedRack({ ...editedRack, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalU">Total U</Label>
                    <Input
                      id="totalU"
                      type="number"
                      value={editedRack.totalU}
                      onChange={(e) => setEditedRack({ ...editedRack, totalU: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button onClick={handleUpdateRack}>Save Changes</Button>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Rack
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Rack</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this rack? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteRack}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AddDeviceDialog rack={rack} onUpdateRack={onUpdateRack} />
          </div>
        </div>
      </div>
      <div className="relative border-x-8 border-rack-rail mt-4">
        {renderSlots()}
      </div>
    </div>
  );
};

export default RackView;