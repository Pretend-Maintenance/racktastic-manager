import { useState, useEffect } from "react";
import { Device, Location } from "@/lib/types";
import { loadState } from "@/lib/storage";
import { MainNav } from "@/components/MainNav";
import { NetworkDeviceNode } from "@/components/network-map/NetworkDeviceNode";

const NetworkMapPage = () => {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setLocation(savedState);
      console.log("Loaded network map state:", savedState);
    }
  }, []);

  if (!location) return null;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Network Connection Map</h1>
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex flex-wrap gap-8">
              {location.racks.flatMap(rack => 
                rack.devices.map(device => (
                  <NetworkDeviceNode 
                    key={device.id} 
                    device={device}
                    connectedDevices={location.racks.flatMap(r => r.devices)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMapPage;