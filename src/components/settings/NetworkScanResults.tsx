import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScanResult {
  ip: string;
  status: string;
  deviceInfo?: any;
}

interface NetworkScanResultsProps {
  results: ScanResult[];
}

export const NetworkScanResults = ({ results }: NetworkScanResultsProps) => {
  if (results.length === 0) return null;

  return (
    <ScrollArea className="h-[300px] border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.ip}</TableCell>
              <TableCell>{result.status}</TableCell>
              <TableCell>{result.deviceInfo ? JSON.stringify(result.deviceInfo) : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};