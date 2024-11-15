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
import { createDefaultAdapters } from "@/lib/storage";

interface AddDeviceDialogProps {
  rack: Rack;
  onUpdateRack: (rack: Rack) => void;
}

export function AddDeviceDialog({ rack, onUpdateRack }: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
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

  const handleDeviceTypeChange = (type: DeviceType) => {
    setNewDevice({ ...newDevice, type });
    setShowTemplate(type === "switch" || type === "firewall");
    setSelectedTemplate("");
  };

  const handleTemplateSelection = (template: string) => {
    console.log("Selected template:", template);
    const adapters = createDefaultAdapters(template);
    setSelectedTemplate(template);
    setNewDevice({ 
      ...newDevice, 
      networkAdapters: adapters,
      model: template
    });
  };

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
      networkAdapters: newDevice.networkAdapters || [],
      status: "inactive",
      assetReference: newDevice.assetReference
    };

    // Create default adapters if no template was selected for switch/firewall
    if ((device.type === "switch" || device.type === "firewall") && device.networkAdapters.length === 0) {
      device.networkAdapters = createDefaultAdapters(device.type === "switch" ? "switch-4" : "firewall");
    }

    const updatedRack = {
      ...rack,
      devices: [...rack.devices, device]
    };

    onUpdateRack(updatedRack);
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
    setSelectedTemplate("");
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
              onValueChange={(value) => handleDeviceTypeChange(value as DeviceType)}
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

          {showTemplate && (
            <div>
              <Label>Device Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {newDevice.type === "switch" && (
                    <>
                      <SelectItem value="switch-4">4-Port Switch</SelectItem>
                      <SelectItem value="switch-24">24-Port Switch</SelectItem>
                    </>
                  )}
                  {newDevice.type === "firewall" && (
                    <SelectItem value="firewall">Standard Firewall (4 ports)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

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