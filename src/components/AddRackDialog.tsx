import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rack } from "@/lib/types";

interface AddRackDialogProps {
  onAddRack: (rack: Omit<Rack, "id" | "devices">) => void;
}

export function AddRackDialog({ onAddRack }: AddRackDialogProps) {
  const [open, setOpen] = useState(false);
  const [newRack, setNewRack] = useState<Partial<Rack>>({
    name: "",
    location: "",
    totalU: 42,
  });

  const handleAddRack = () => {
    if (!newRack.name || !newRack.location) return;
    
    onAddRack({
      name: newRack.name,
      location: newRack.location,
      totalU: newRack.totalU || 42,
    });

    setNewRack({
      name: "",
      location: "",
      totalU: 42,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Rack
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Rack</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Rack Name</Label>
            <Input
              id="name"
              value={newRack.name}
              onChange={(e) => setNewRack({ ...newRack, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newRack.location}
              onChange={(e) => setNewRack({ ...newRack, location: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="totalU">Total U</Label>
            <Input
              id="totalU"
              type="number"
              value={newRack.totalU}
              onChange={(e) => setNewRack({ ...newRack, totalU: parseInt(e.target.value) })}
            />
          </div>
          <Button onClick={handleAddRack}>Add Rack</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}