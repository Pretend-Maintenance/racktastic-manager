import { Device } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditDeviceFormProps {
  device: Device;
  onSave: (updatedDevice: Device) => void;
  onCancel: () => void;
}

export const EditDeviceForm = ({ device, onSave, onCancel }: EditDeviceFormProps) => {
  const [formData, setFormData] = useState(device);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Device Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="manufacturer">Manufacturer</Label>
        <Input
          id="manufacturer"
          value={formData.manufacturer}
          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="height">Height (U)</Label>
        <Input
          id="height"
          type="number"
          min="1"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          type="number"
          min="1"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="ipAddress">IP Address</Label>
        <Input
          id="ipAddress"
          value={formData.ipAddress || ''}
          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
          placeholder="e.g., 192.168.1.1"
        />
      </div>
      <div>
        <Label htmlFor="macAddress">MAC Address</Label>
        <Input
          id="macAddress"
          value={formData.macAddress || ''}
          onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
          placeholder="e.g., 00:11:22:33:44:55"
        />
      </div>
      <div>
        <Label htmlFor="assetReference">Asset Reference</Label>
        <Input
          id="assetReference"
          value={formData.assetReference || ''}
          onChange={(e) => setFormData({ ...formData, assetReference: e.target.value })}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};