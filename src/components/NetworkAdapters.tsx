import { NetworkAdapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Cable, Plus } from "lucide-react";
import { toast } from "sonner";

interface NetworkAdaptersProps {
  adapters: NetworkAdapter[];
  onUpdate: (adapters: NetworkAdapter[]) => void;
}

const NetworkAdapters = ({ adapters, onUpdate }: NetworkAdaptersProps) => {
  const toggleConnection = (id: string) => {
    const newAdapters = adapters.map(adapter =>
      adapter.id === id
        ? { ...adapter, connected: !adapter.connected }
        : adapter
    );
    onUpdate(newAdapters);
    toast.success(`Port ${id} connection ${newAdapters.find(a => a.id === id)?.connected ? 'enabled' : 'disabled'}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Network Adapters</h3>
        <Button variant="outline" size="sm" onClick={() => toast.info("Add adapter coming soon!")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Adapter
        </Button>
      </div>
      
      <div className="space-y-3">
        {adapters.map((adapter) => (
          <div
            key={adapter.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="space-y-1">
              <div className="font-medium">{adapter.name}</div>
              <div className="text-sm text-muted-foreground">
                {adapter.type} - {adapter.speed}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Port {adapter.port}</span>
              <Button
                variant={adapter.connected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleConnection(adapter.id)}
              >
                <Cable className={`w-4 h-4 ${adapter.connected ? "text-white" : ""}`} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkAdapters;