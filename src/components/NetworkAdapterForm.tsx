import { NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createDefaultAdapters } from "@/lib/storage";

interface NetworkAdapterFormProps {
  onAdd: (adapter: Omit<NetworkAdapter, "id">) => void;
  onClose: () => void;
  refreshPane: () => void;
}

export const NetworkAdapterForm = ({ onAdd, onClose, refreshPane }: NetworkAdapterFormProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleTemplateSelection = (template: string) => {
    setSelectedTemplate(template);
    const adapters = createDefaultAdapters(template);
    adapters.forEach(adapter => {
      const { id, ...adapterWithoutId } = adapter;
      onAdd(adapterWithoutId);
    });
    refreshPane();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">Select Template</label>
        <Select onValueChange={handleTemplateSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="switch-4">Generic 4-Port Switch</SelectItem>
            <SelectItem value="switch-24">Generic 24-Port Switch</SelectItem>
            <SelectItem value="firewall">Generic Firewall</SelectItem>
            <SelectItem value="custom">Custom Network Adapter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedTemplate === "custom" && (
        <form className="space-y-4">
          <div>
            <label className="required">Adapter Name *</label>
            <Input
              placeholder="Adapter Name"
              required
            />
          </div>
          <div>
            <label className="required">Adapter Type *</label>
            <Select>
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
            <Select>
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
            />
          </div>
          <div>
            <label>IP Address</label>
            <Input
              placeholder="IP Address"
            />
          </div>
          <div>
            <label>VLAN</label>
            <Input
              placeholder="VLAN"
            />
          </div>
          <Button type="submit">Add Adapter</Button>
        </form>
      )}
    </div>
  );
};
