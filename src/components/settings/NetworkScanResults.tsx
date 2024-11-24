import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  ip: string;
  status: string;
  deviceInfo?: any;
}

interface NetworkScanResultsProps {
  results: ScanResult[];
  onImportDevice: (deviceInfo: any) => void;
}

export const NetworkScanResults = ({ results, onImportDevice }: NetworkScanResultsProps) => {
  const handleImport = (result: ScanResult) => {
    if (!result.deviceInfo) {
      toast.error("No device information available to import");
      return;
    }

    onImportDevice(result.deviceInfo);
    toast.success(`Device at ${result.ip} imported successfully`);
  };

  if (results.length === 0) return null;

  return (
    <ScrollArea className="h-[300px] border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.ip}</TableCell>
              <TableCell>{result.status}</TableCell>
              <TableCell>
                {result.deviceInfo ? (
                  <div className="space-y-1">
                    <div>Type: {result.deviceInfo.type}</div>
                    <div>Manufacturer: {result.deviceInfo.manufacturer}</div>
                    <div>Model: {result.deviceInfo.model}</div>
                  </div>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                {result.deviceInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImport(result)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Import
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};