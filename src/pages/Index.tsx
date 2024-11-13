import { useState } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Sample data with location
const sampleLocation: Location = {
  id: "loc1",
  name: "Data Center 1",
  racks: [
    {
      id: "rack1",
      name: "Rack A1",
      location: "Row 1",
      totalU: 42,
      devices: [
    {
      id: "dev1",
      name: "Web Server 1",
      type: "server",
      manufacturer: "Dell",
      model: "PowerEdge R740",
      height: 2,
      position: 40,
      status: "active",
      networkAdapters: [
        {
          id: "nic1",
          name: "Primary NIC",
          type: "ethernet",
          speed: "10GbE",
          port: 1,
          connected: true,
        },
        {
          id: "nic2",
          name: "Backup NIC",
          type: "ethernet",
          speed: "10GbE",
          port: 2,
          connected: false,
        },
      ],
    },
    {
      id: "dev2",
      name: "Core Switch",
      type: "switch",
      manufacturer: "Cisco",
      model: "Nexus 9300",
      height: 1,
      position: 38,
      status: "active",
      networkAdapters: [
        {
          id: "port1",
          name: "Uplink 1",
          type: "fiber",
          speed: "100GbE",
          port: 1,
          connected: true,
        },
      ],
    },
    {
      id: "dev3",
      name: "Storage Array",
      type: "storage",
      manufacturer: "NetApp",
      model: "FAS8700",
      height: 4,
      position: 33,
      status: "maintenance",
      networkAdapters: [
        {
          id: "san1",
          name: "SAN Interface",
          type: "fiber",
          speed: "32Gb FC",
          port: 1,
          connected: true,
        },
      ],
    },
      ],
    },
  ],
};

const Index = () => {
  const [location, setLocation] = useState<Location>(sampleLocation);
  const [selectedRack, setSelectedRack] = useState<Rack>(sampleLocation.racks[0]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateRack = (updatedRack: Rack) => {
    const newRacks = location.racks.map(rack =>
      rack.id === updatedRack.id ? updatedRack : rack
    );
    setLocation({ ...location, racks: newRacks });
    setSelectedRack(updatedRack);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    const newDevices = selectedRack.devices.map(device =>
      device.id === updatedDevice.id ? updatedDevice : device
    );
    const updatedRack = { ...selectedRack, devices: newDevices };
    handleUpdateRack(updatedRack);
  };

  const handleNameChange = (newName: string) => {
    const updatedRack = { ...selectedRack, name: newName };
    handleUpdateRack(updatedRack);
    toast.success("Rack name updated");
  };

  const handleLocationChange = (newLocation: string) => {
    const updatedRack = { ...selectedRack, location: newLocation };
    handleUpdateRack(updatedRack);
    toast.success("Rack location updated");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Data Center Management</h1>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={selectedRack.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Rack Name"
                  />
                  <Input
                    value={selectedRack.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Rack Location"
                  />
                  <Button onClick={() => setIsEditing(false)}>Save</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Rack Details
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <RackView
            rack={selectedRack}
            onSelectDevice={setSelectedDevice}
            onUpdateRack={handleUpdateRack}
          />
        </div>
      </div>

      {selectedDevice && (
        <DevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleUpdateDevice}
          availableDevices={selectedRack.devices}
        />
      )}
    </div>
  );
};

export default Index;
