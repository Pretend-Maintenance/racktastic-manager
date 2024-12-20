import { useState, useEffect } from "react";
import { Device, Rack, Location } from "@/lib/types";
import DevicePanel from "@/components/DevicePanel";
import { MainNav } from "@/components/MainNav";
import { toast } from "sonner";
import { saveState, loadState, logTransaction, clearAllData } from "@/lib/storage";
import { RackGroup } from "@/components/rack/RackGroup";

const defaultLocation: Location = {
  id: "loc1",
  name: "Data Center 1",
  racks: [],
};

const Index = () => {
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      console.log("Loading saved state:", savedState);
      setLocation(savedState);
      if (savedState.racks.length > 0) {
        setSelectedRack(savedState.racks[0]);
      }
    } else {
      console.log("No saved state found, using default");
      setLocation(defaultLocation);
    }
  }, []);

  const handleUpdateRack = (updatedRack: Rack) => {
    console.log("Updating rack:", updatedRack);
    
    const existingRackIndex = location.racks.findIndex(rack => rack.id === updatedRack.id);
    let newRacks: Rack[];
    
    if (existingRackIndex === -1) {
      newRacks = [...location.racks, updatedRack];
      console.log("Adding new rack to location");
    } else {
      newRacks = location.racks.map(rack =>
        rack.id === updatedRack.id ? updatedRack : rack
      );
      console.log("Updating existing rack");
    }

    const newLocation = { ...location, racks: newRacks };
    console.log("New location state:", newLocation);
    
    setLocation(newLocation);
    setSelectedRack(updatedRack);
    saveState(newLocation);
    toast.success(existingRackIndex === -1 ? "Rack added successfully" : "Rack updated successfully");
  };

  const handleDeleteRack = (rackId: string) => {
    const rackToDelete = location.racks.find(rack => rack.id === rackId);
    if (!rackToDelete) return;

    const newRacks = location.racks.filter(rack => rack.id !== rackId);
    const newLocation = { ...location, racks: newRacks };
    
    logTransaction(
      "deleted",
      "rack",
      rackToDelete.name,
      [{
        field: "Rack",
        oldValue: rackToDelete.name,
        newValue: ""
      }]
    );

    setLocation(newLocation);
    setSelectedRack(newRacks[0] || null);
    saveState(newLocation);
    toast.success("Rack deleted successfully");
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    console.log("Updating device:", updatedDevice);
    
    if (!selectedRack) {
      console.error("No rack selected for device update");
      return;
    }

    const updatedDevices = selectedRack.devices.map(device =>
      device.id === updatedDevice.id ? updatedDevice : device
    );

    const updatedRack = { ...selectedRack, devices: updatedDevices };
    
    const newLocation = {
      ...location,
      racks: location.racks.map(rack =>
        rack.id === selectedRack.id ? updatedRack : rack
      ),
    };

    console.log("Updated location state:", newLocation);
    setLocation(newLocation);
    saveState(newLocation);
    
    logTransaction(
      "updated",
      "device",
      updatedDevice.name,
      [{
        field: "Device",
        oldValue: selectedDevice?.name || "",
        newValue: updatedDevice.name
      }],
      updatedDevice
    );

    toast.success("Device updated successfully");
  };

  // Group racks by location
  const groupedRacks = location.racks.reduce((groups: { [key: string]: Rack[] }, rack) => {
    const location = rack.location || 'Unspecified';
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(rack);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Data Center Management</h1>
          </div>
          <div className="mb-8 space-y-8">
            {Object.entries(groupedRacks).length > 0 ? (
              Object.entries(groupedRacks).map(([locationName, racks]) => (
                <RackGroup
                  key={locationName}
                  locationName={locationName}
                  racks={racks}
                  onSelectRack={setSelectedRack}
                  onSelectDevice={setSelectedDevice}
                  onUpdateRack={handleUpdateRack}
                  onDeleteRack={handleDeleteRack}
                />
              ))
            ) : (
              <RackGroup
                locationName="Data Center 1"
                racks={[]}
                onSelectRack={setSelectedRack}
                onSelectDevice={setSelectedDevice}
                onUpdateRack={handleUpdateRack}
                onDeleteRack={handleDeleteRack}
              />
            )}
          </div>
        </div>
      </div>

      {selectedDevice && (
        <DevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleUpdateDevice}
          onDelete={(deviceId) => {
            if (!selectedRack) return;
            
            const updatedDevices = selectedRack.devices.filter(
              device => device.id !== deviceId
            );
            
            const updatedRack = { ...selectedRack, devices: updatedDevices };
            handleUpdateRack(updatedRack);
          }}
          availableDevices={location.racks.flatMap(rack => rack.devices)}
        />
      )}
    </div>
  );
};

export default Index;