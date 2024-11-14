import { useState, useEffect } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { MainNav } from "@/components/MainNav";
import { toast } from "sonner";
import { AddRackDialog } from "@/components/AddRackDialog";
import { saveState, loadState } from "@/lib/storage";

const defaultLocation: Location = {
  id: "loc1",
  name: "Data Center 1",
  racks: [],
};

const Index = () => {
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setLocation(savedState);
      if (savedState.racks.length > 0) {
        setSelectedRack(savedState.racks[0]);
      }
    }
  }, []);

  const handleUpdateRack = (updatedRack: Rack) => {
    const newRacks = location.racks.map(rack =>
      rack.id === updatedRack.id ? updatedRack : rack
    );
    const newLocation = { ...location, racks: newRacks };
    setLocation(newLocation);
    setSelectedRack(updatedRack);
    saveState(newLocation);

    // Log the rack update
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Updated",
      itemType: "rack",
      itemId: updatedRack.id,
      itemName: updatedRack.name,
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
  };

  const handleDeleteRack = (rackId: string) => {
    const newRacks = location.racks.filter(rack => rack.id !== rackId);
    const newLocation = { ...location, racks: newRacks };
    setLocation(newLocation);
    setSelectedRack(newRacks[0] || null);
    saveState(newLocation);

    // Log the rack deletion
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Deleted",
      itemType: "rack",
      itemId: rackId,
      itemName: selectedRack?.name || "",
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
  };

  const handleAddRack = (rackData: Omit<Rack, "id" | "devices">) => {
    const newRack: Rack = {
      id: crypto.randomUUID(),
      ...rackData,
      devices: [],
    };

    const newLocation = {
      ...location,
      racks: [...location.racks, newRack],
    };
    
    setLocation(newLocation);
    setSelectedRack(newRack);
    saveState(newLocation);

    // Log the rack addition
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Added",
      itemType: "rack",
      itemId: newRack.id,
      itemName: newRack.name,
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
    toast.success("Rack added successfully");
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    if (!selectedRack) return;

    const updatedRack = {
      ...selectedRack,
      devices: selectedRack.devices.map(device =>
        device.id === updatedDevice.id ? updatedDevice : device
      ),
    };

    handleUpdateRack(updatedRack);
    setSelectedDevice(updatedDevice);

    // Log the device update
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Updated",
      itemType: "device",
      itemId: updatedDevice.id,
      itemName: updatedDevice.name,
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <MainNav />
        <AddRackDialog onAddRack={handleAddRack} />
      </div>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {location.racks.map((rack) => (
                <div
                  key={rack.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedRack(rack)}
                >
                  <RackView
                    rack={rack}
                    onSelectDevice={setSelectedDevice}
                    onUpdateRack={handleUpdateRack}
                    onDeleteRack={handleDeleteRack}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedDevice && (
        <DevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleUpdateDevice}
          availableDevices={selectedRack?.devices || []}
        />
      )}
    </div>
  );
};

export default Index;