import { useState } from "react";
import { Rack } from "@/lib/types";
import { Plus, Edit, Trash2, MoreVertical, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddDeviceDialog } from "../dialogs/AddDeviceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RackHeaderProps {
  rack: Rack;
  onUpdateRack: (rack: Rack) => void;
  onDeleteRack: (rackId: string) => void;
}

export const RackHeader = ({ rack, onUpdateRack, onDeleteRack }: RackHeaderProps) => {
  const [isEditingRack, setIsEditingRack] = useState(false);
  const [editedRack, setEditedRack] = useState(rack);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Rack Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAddDevice(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditingRack(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Rack
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Rack Information</DropdownMenuLabel>
          <DropdownMenuItem>
            <Info className="mr-2 h-4 w-4" />
            Total U: {rack.totalU}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Info className="mr-2 h-4 w-4" />
            Devices: {rack.devices.length}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditingRack} onOpenChange={setIsEditingRack}>
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

      <AddDeviceDialog 
        rack={rack} 
        onUpdateRack={onUpdateRack} 
      />
    </div>
  );
};