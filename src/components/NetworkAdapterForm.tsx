import { NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NetworkAdapterFormProps {
  onAdd: (adapter: Omit<NetworkAdapter, "id">) => void;
}

export const NetworkAdapterForm = ({ onAdd }: NetworkAdapterFormProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"ethernet" | "fiber">("ethernet");
  const [speed, setSpeed] = useState("");
  const [port, setPort] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type,
      speed,
      port: parseInt(port),
      connected: false
    });
    setName("");
    setType("ethernet");
    setSpeed("");
    setPort("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Adapter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
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
      <div>
        <Input
          placeholder="Speed (e.g., 1GbE, 10GbE)"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Port Number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          required
          min="1"
        />
      </div>
      <Button type="submit">Add Adapter</Button>
    </form>
  );
};