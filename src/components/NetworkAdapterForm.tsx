import { NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";


interface NetworkAdapterFormProps {
  onAdd: (adapter: Omit<NetworkAdapter, "id">) => void;
  onClose: () => void;
  refreshPane: () => void;
}

export const NetworkAdapterForm = ({ onAdd, onClose, refreshPane }: NetworkAdapterFormProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"ethernet" | "fiber">("ethernet");
  const [speed, setSpeed] = useState(""); // State to hold the selected/custom speed
  const [port, setPort] = useState("");
  const [ip, setIp] = useState("");
  const [vlan, setVlan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type,
      speed: speed || "N/A",
      port: port || "N/A",
      ip,
      vlan,
      connected: false,
    });
    refreshPane();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="required">Adapter Name *</label>
        <Input
          placeholder="Adapter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="required">Adapter Type *</label>
        <Select value={type} onValueChange={(value: "ethernet" | "fiber") => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethernet">Ethernet</SelectItem>
            <SelectItem value="fiber">Fiber</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Select value={type} onValueChange={(value: "100Mbit" | "1Gbit"| "2.5Gbit" | "10Gbit" | "100Gbit") => setSpeed(value)}>
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
      <div>
        <label>Port Name</label>
        <Input
          placeholder="Port Name"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
      </div>
      <div>
        <label>IP Address</label>
        <Input
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
      </div>
      <div>
        <label>VLAN</label>
        <Input
          placeholder="VLAN"
          value={vlan}
          onChange={(e) => setVlan(e.target.value)}
        />
      </div>
      <Button type="submit">Add Adapter</Button>
    </form>
  );
};
