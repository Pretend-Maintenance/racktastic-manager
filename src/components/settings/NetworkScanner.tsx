import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { NetworkScanResults } from "./NetworkScanResults";
import { scanNetwork } from "@/lib/network-scanner";
import { Device } from "@/lib/types";

export const NetworkScanner = () => {
  const [startIp, setStartIp] = useState("192.168.1.1");
  const [endIp, setEndIp] = useState("192.168.1.254");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>("");
  const [results, setResults] = useState<Array<{ip: string, status: string, deviceInfo?: any}>>([]);

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setResults([]);
      setScanProgress("Initializing scan...");
      console.log("Starting network scan from", startIp, "to", endIp);
      
      const scanResults = await scanNetwork(startIp, endIp, (progress) => {
        setScanProgress(progress);
        console.log("Scan progress:", progress);
      });
      
      setResults(scanResults);
      setScanProgress("");
      toast.success("Network scan completed");
    } catch (error) {
      console.error("Scan failed:", error);
      toast.error("Failed to complete network scan");
      setScanProgress("");
    } finally {
      setIsScanning(false);
    }
  };

  const handleImportDevice = (deviceInfo: any) => {
    // Here you would typically integrate with your device management system
    console.log("Importing device:", deviceInfo);
    // You can add additional logic here to add the device to your system
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start IP</label>
          <Input
            value={startIp}
            onChange={(e) => setStartIp(e.target.value)}
            placeholder="192.168.1.1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">End IP</label>
          <Input
            value={endIp}
            onChange={(e) => setEndIp(e.target.value)}
            placeholder="192.168.1.254"
          />
        </div>
      </div>
      <Button 
        onClick={handleScan} 
        disabled={isScanning}
        className="w-full"
      >
        {isScanning ? "Scanning..." : "Start Network Scan"}
      </Button>
      
      {scanProgress && (
        <div className="text-sm text-muted-foreground">{scanProgress}</div>
      )}
      
      <NetworkScanResults 
        results={results} 
        onImportDevice={handleImportDevice}
      />
    </div>
  );
};