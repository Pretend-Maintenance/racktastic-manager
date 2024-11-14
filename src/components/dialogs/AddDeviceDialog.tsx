import { useState } from "react";
import { Device, Rack, DeviceType } from "@/lib/types";
import { Plus } from "lucide-react";
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

interface AddDeviceDialogProps {
  rack: Rack;
  onUpdateRack: (rack: Rack) => void;
}

export function AddDeviceDialog({ rack, onUpdateRack }: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false);
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

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.manufacturer || !newDevice.model) {
      toast.error("Please fill in all required fields");
      return;
    }

    const device: Device = {
      id: crypto.randomUUID(),
      name: newDevice.name,
      type: newDevice.type as DeviceType,
      manufacturer: newDevice.manufacturer,
      model: newDevice.model,
      height: newDevice.height || 1,
      position: newDevice.position || 1,
      networkAdapters: [],
      status: "inactive",
      assetReference: newDevice.assetReference
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

    setOpen(false);
    toast.success("Device added successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
  );
}