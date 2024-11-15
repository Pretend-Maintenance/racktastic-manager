import { NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NetworkAdapterFormProps {
  onAdd: (adapter: Omit<NetworkAdapter, "id">) => void;
  onClose: () => void;
}

export const NetworkAdapterForm = ({ onAdd, onClose }: NetworkAdapterFormProps) => {
  const [adapter, setAdapter] = useState<Omit<NetworkAdapter, "id">>({
    name: "",
    type: "ethernet",
    speed: "1Gbit",
    port: "",
    connected: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(adapter);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="required">Adapter Name *</label>
        <Input
          placeholder="Adapter Name"
          value={adapter.name}
          onChange={(e) => setAdapter({ ...adapter, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="required">Adapter Type *</label>
        <Select
          value={adapter.type}
          onValueChange={(value: "ethernet" | "fiber") => setAdapter({ ...adapter, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethernet">Ethernet</SelectItem>
            <SelectItem value="fiber">Fiber</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Speed Select</label>
        <Select
          value={adapter.speed}
          onValueChange={(value) => setAdapter({ ...adapter, speed: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100Mbit">100Mbit</SelectItem>
            <SelectItem value="1Gbit">1Gbit</SelectItem>
            <SelectItem value="2.5Gbit">2.5Gbit</SelectItem>
            <SelectItem value="10Gbit">10Gbit</SelectItem>
            <SelectItem value="100Gbit">100Gbit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Port Name</label>
        <Input
          placeholder="Port Name"
          value={adapter.port}
          onChange={(e) => setAdapter({ ...adapter, port: e.target.value })}
        />
      </div>
      <Button type="submit">Add Adapter</Button>
    </form>
  );
};