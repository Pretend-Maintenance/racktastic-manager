import { Button } from "@/components/ui/button";

export const SecuritySection = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Access Control</h3>
        <Button variant="outline" className="w-full">
          Configure Permissions
        </Button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Audit Log</h3>
        <Button variant="outline" className="w-full">
          View Audit Log
        </Button>
      </div>
    </div>
  );
};