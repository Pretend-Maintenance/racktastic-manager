import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { NetworkScanResults } from "./NetworkScanResults";
import { scanNetwork } from "@/lib/network-scanner";
import { Device, Rack } from "@/lib/types";
import { loadState } from "@/lib/storage";

export const NetworkScanner = () => {
  const [startIp, setStartIp] = useState("192.168.1.1");
  const [endIp, setEndIp] = useState("192.168.1.254");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>("");
  const [results, setResults] = useState<Array<{ip: string, status: string, deviceInfo?: any}>>([]);
  const [racks, setRacks] = useState<Rack[]>([]);

  // Load racks and saved scan results on mount
  useEffect(() => {
    const state = loadState();
    if (state) {
      setRacks(state.racks);
    }

    const savedResults = localStorage.getItem('networkScanResults');
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        setResults(parsed);
        console.log("Loaded saved scan results:", parsed);
      } catch (error) {
        console.error("Error loading saved scan results:", error);
      }
    }
  }, []);

  const handleScan = async () => {
    try {
      setIsScanning(true);
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

  const handleImportDevice = (deviceInfo: any, rackId: string) => {
    const state = loadState();
    if (!state) {
      toast.error("Could not load current state");
      return;
    }

    const selectedRack = state.racks.find(r => r.id === rackId);
    if (!selectedRack) {
      toast.error("Selected rack not found");
      return;
    }

    // Create device with default position
    const newDevice: Device = {
      id: crypto.randomUUID(),
      name: `${deviceInfo.manufacturer} ${deviceInfo.model}`,
      type: deviceInfo.type,
      manufacturer: deviceInfo.manufacturer,
      model: deviceInfo.model,
      height: 1, // Default height
      position: 1, // Default position
      networkAdapters: [],
      status: "inactive"
    };

    // Update rack with new device
    const updatedRack = {
      ...selectedRack,
      devices: [...selectedRack.devices, newDevice]
    };

    // Update state
    const updatedRacks = state.racks.map(r => 
      r.id === rackId ? updatedRack : r
    );

    state.racks = updatedRacks;
    localStorage.setItem('datacenter_status', JSON.stringify(state));
    setRacks(updatedRacks);

    console.log("Device imported:", newDevice);
    console.log("Updated rack:", updatedRack);
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
        racks={racks}
      />
    </div>
  );
};