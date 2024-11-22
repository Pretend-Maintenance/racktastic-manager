import { Button } from "@/components/ui/button";
import { X, Trash2, Edit } from "lucide-react";

interface DeviceHeaderProps {
  deviceName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const DeviceHeader = ({ deviceName, onEdit, onDelete, onClose }: DeviceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{deviceName}</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};