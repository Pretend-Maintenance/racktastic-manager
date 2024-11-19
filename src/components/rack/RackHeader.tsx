import { useState } from "react";
import { Rack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical } from "lucide-react";
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

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">{rack.name}</h2>
        <p className="text-sm text-gray-300">Location: {rack.location}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Rack Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowAddDevice(true)}>
            Add Device
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditingRack(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Rack
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setShowDeleteConfirm(true)}
          >
            Delete Rack
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Rack Dialog */}
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
            <Button onClick={handleUpdateRack}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
            <Button variant="destructive" onClick={() => onDeleteRack(rack.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Device Dialog */}
      <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Device</DialogTitle>
          </DialogHeader>
          <AddDeviceDialog 
            rack={rack} 
            onUpdateRack={onUpdateRack}
            onClose={() => setShowAddDevice(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};