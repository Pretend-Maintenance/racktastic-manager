import { useState, useEffect } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { MainNav } from "@/components/MainNav";
import { toast } from "sonner";
import { AddRackDialog } from "@/components/AddRackDialog";
import { saveState, loadState, updateConnectedDevices, logTransaction } from "@/lib/storage";

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
    
    logTransaction(
      "created",
      "rack",
      newRack.name,
      [{
        field: "Rack",
        oldValue: "",
        newValue: newRack.name
      },
      {
        field: "Location",
        oldValue: "",
        newValue: newRack.location
      },
      {
        field: "Total U",
        oldValue: "",
        newValue: newRack.totalU.toString()
      }]
    );
    
    setLocation(newLocation);
    setSelectedRack(newRack);
    saveState(newLocation);
    toast.success("Rack added successfully");
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    if (!selectedRack) return;

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

  // Group racks by location
  const groupedRacks = location.racks.reduce((groups: { [key: string]: Rack[] }, rack) => {
    const location = rack.location || 'Unspecified';
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(rack);
    return groups;
  }, {});

  useEffect(() => {
    const handleDeviceAdapterUpdate = (event: CustomEvent<{deviceId: string, adapters: NetworkAdapter[]}>) => {
      const { deviceId, adapters } = event.detail;
      const updatedRacks = location.racks.map(rack => ({
        ...rack,
        devices: rack.devices.map(device => 
          device.id === deviceId
            ? { ...device, networkAdapters: adapters }
            : device
        )
      }));
      
      setLocation({ ...location, racks: updatedRacks });
      saveState({ ...location, racks: updatedRacks });
    };

    window.addEventListener('updateDeviceAdapters', handleDeviceAdapterUpdate as EventListener);
    return () => {
      window.removeEventListener('updateDeviceAdapters', handleDeviceAdapterUpdate as EventListener);
    };
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Data Center Management</h1>
          </div>
          <div className="mb-8 space-y-8">
            {Object.entries(groupedRacks).map(([locationName, racks]) => (
              <div key={locationName} className="space-y-4">
                <h2 className="text-xl font-semibold">{locationName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {racks.map((rack) => (
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
            ))}
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
          availableDevices={location.racks.flatMap(rack => rack.devices)}
        />
      )}
    </div>
  );
};

export default Index;