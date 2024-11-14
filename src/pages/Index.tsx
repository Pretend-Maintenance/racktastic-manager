import { useState, useEffect } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { MainNav } from "@/components/MainNav";
import { toast } from "sonner";
import { AddRackDialog } from "@/components/AddRackDialog";
import { saveState, loadState, updateConnectedDevices } from "@/lib/storage";

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
  };

  const handleDeleteRack = (rackId: string) => {
    const newRacks = location.racks.filter(rack => rack.id !== rackId);
    const newLocation = { ...location, racks: newRacks };
    setLocation(newLocation);
    setSelectedRack(newRacks[0] || null);
    saveState(newLocation);
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
    toast.success("Rack added successfully");
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    if (!selectedRack) return;

    // Update both connected devices if there's a network connection change
    const updatedDevices = updateConnectedDevices(
      selectedRack.devices,
      updatedDevice,
      updatedDevice.networkAdapters[0]?.connectedToDevice || '',
      updatedDevice.networkAdapters[0]?.id || '',
      updatedDevice.networkAdapters[0]?.connected || false
    );

    const updatedRack = {
      ...selectedRack,
      devices: updatedDevices,
    };

    handleUpdateRack(updatedRack);
    setSelectedDevice(updatedDevice);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-start gap-6">
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
            <div className="mt-4">
              <AddRackDialog onAddRack={handleAddRack} />
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