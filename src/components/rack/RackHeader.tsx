import { useState } from "react";
import { Rack } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddDeviceDialog } from "../dialogs/AddDeviceDialog";

interface RackHeaderProps {
  rack: Rack;
  onUpdateRack: (rack: Rack) => void;
  onDeleteRack: (rackId: string) => void;
}

export const RackHeader = ({ rack, onUpdateRack, onDeleteRack }: RackHeaderProps) => {
  const [isEditingRack, setIsEditingRack] = useState(false);
  const [editedRack, setEditedRack] = useState(rack);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateRack = () => {
    onUpdateRack(editedRack);
    setIsEditingRack(false);
    toast.success("Rack updated successfully");
  };

  const handleDeleteRack = () => {
    onDeleteRack(rack.id);
    setShowDeleteConfirm(false);
    toast.success("Rack deleted successfully");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">{rack.name}</h2>
        <p className="text-sm text-gray-300">Location: {rack.location}</p>
      </div>
      <div className="flex gap-2">
        <Dialog open={isEditingRack} onOpenChange={setIsEditingRack}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Rack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Rack</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Rack Name</Label>
                <Input
                  id="name"
                  value={editedRack.name}
                  onChange={(e) => setEditedRack({ ...editedRack, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedRack.location}
                  onChange={(e) => setEditedRack({ ...editedRack, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="totalU">Total U</Label>
                <Input
                  id="totalU"
                  type="number"
                  value={editedRack.totalU}
                  onChange={(e) => setEditedRack({ ...editedRack, totalU: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-between">
                <Button onClick={handleUpdateRack}>Save Changes</Button>
                <Button 
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Rack
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Rack</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this rack? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRack}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddDeviceDialog rack={rack} onUpdateRack={onUpdateRack} />
      </div>
    </div>
  );
};