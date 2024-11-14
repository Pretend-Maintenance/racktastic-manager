import { useState } from "react";
import { Device, Rack, DeviceType } from "@/lib/types";
import { Server, Network, Shield, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface RackViewProps {
  rack: Rack;
  onSelectDevice: (device: Device) => void;
  onUpdateRack: (rack: Rack) => void;
}

const RackView = ({ rack, onSelectDevice, onUpdateRack }: RackViewProps) => {
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    name: "",
    type: "server",
    manufacturer: "",
    model: "",
    height: 1,
    position: 1,
    networkAdapters: [],
    status: "inactive"
  });

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

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const device: Device = {
      id: crypto.randomUUID(),
      name: newDevice.name,
      type: newDevice.type as DeviceType,
      manufacturer: newDevice.manufacturer || "Unknown",
      model: newDevice.model || "Generic",
      height: newDevice.height || 1,
      position: newDevice.position || 1,
      networkAdapters: [],
      status: "inactive"
    };

    onUpdateRack({
      ...rack,
      devices: [...rack.devices, device]
    });

    setNewDevice({
      name: "",
      type: "server",
      manufacturer: "",
      model: "",
      height: 1,
      position: 1,
      networkAdapters: [],
      status: "inactive"
    });

    toast.success("Device added successfully");
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Device Type *</Label>
                  <Select
                    value={newDevice.type}
                    onValueChange={(value) => setNewDevice({ ...newDevice, type: value as DeviceType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                      <SelectItem value="firewall">Firewall</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    value={newDevice.manufacturer}
                    onChange={(e) => setNewDevice({ ...newDevice, manufacturer: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (U) *</Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={newDevice.height}
                    onChange={(e) => setNewDevice({ ...newDevice, height: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    type="number"
                    min="1"
                    max={rack.totalU}
                    value={newDevice.position}
                    onChange={(e) => setNewDevice({ ...newDevice, position: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="assetReference">Asset Reference</Label>
                  <Input
                    id="assetReference"
                    value={newDevice.assetReference}
                    onChange={(e) => setNewDevice({ ...newDevice, assetReference: e.target.value })}
                    placeholder="Optional asset reference"
                  />
                </div>
                <Button onClick={handleAddDevice}>Add Device</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative border-x-8 border-rack-rail mt-4">
        {renderSlots()}
      </div>
    </div>
  );
};

export default RackView;