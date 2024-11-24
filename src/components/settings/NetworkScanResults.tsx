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
import { Device, Rack } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ScanResult {
  ip: string;
  status: string;
  deviceInfo?: any;
}

interface NetworkScanResultsProps {
  results: ScanResult[];
  onImportDevice: (deviceInfo: any, rackId?: string) => void;
  racks: Rack[];
}

export const NetworkScanResults = ({ results, onImportDevice, racks }: NetworkScanResultsProps) => {
  const [selectedRacks, setSelectedRacks] = useState<{[key: string]: string}>({});
  
  // Load results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('networkScanResults');
    if (savedResults) {
      console.log("Loading saved scan results");
    }
  }, []);

  // Save results to localStorage when they change
  useEffect(() => {
    console.log("Saving scan results to localStorage");
    localStorage.setItem('networkScanResults', JSON.stringify(results));
  }, [results]);

  const handleImport = (result: ScanResult, index: string) => {
    if (!result.deviceInfo) {
      toast.error("No device information available to import");
      return;
    }

    const rackId = selectedRacks[index];
    if (!rackId) {
      toast.error("Please select a rack first");
      return;
    }

    onImportDevice(result.deviceInfo, rackId);
    toast.success(`Device at ${result.ip} imported successfully to selected rack`);
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
            <TableHead>Rack</TableHead>
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
                  <Select
                    value={selectedRacks[index]}
                    onValueChange={(value) => setSelectedRacks(prev => ({...prev, [index]: value}))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a rack" />
                    </SelectTrigger>
                    <SelectContent>
                      {racks.map((rack) => (
                        <SelectItem key={rack.id} value={rack.id}>
                          {rack.name} ({rack.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {result.deviceInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImport(result, index.toString())}
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