import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdapterHeaderProps {
  onOpenDialog: () => void;
}

export const AdapterHeader = ({ onOpenDialog }: AdapterHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Network Adapters</h3>
      <Button variant="outline" size="sm" onClick={onOpenDialog}>
        <Plus className="w-4 h-4 mr-2" />
        Add Adapter
      </Button>
    </div>
  );
};