import { useState } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          assetReference: "WS-001",
          networkAdapters: [
            {
              id: "nic1",
              name: "Primary NIC",
              type: "ethernet",
              speed: "10GbE",
              port: "1",
              connected: true,
            },
            {
              id: "nic2",
              name: "Backup NIC",
              type: "ethernet",
              speed: "10GbE",
              port: "2",
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
              port: "1",
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
              port: "1",
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
  const [newRackName, setNewRackName] = useState("");
  const [newRackLocation, setNewRackLocation] = useState("");
  const [dataCenterName, setDataCenterName] = useState(location.name);

  // Handle data center name update
  const handleDataCenterNameChange = (newName: string) => {
    setLocation(prev => ({ ...prev, name: newName }));
    setDataCenterName(newName);
    toast.success("Data center name updated");
  };

  // Handle adding new rack
  const handleAddRack = () => {
    if (!newRackName || !newRackLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRack: Rack = {
      id: crypto.randomUUID(),
      name: newRackName,
      location: newRackLocation,
      totalU: 42, // Default size
      devices: [],
    };

    setLocation(prev => ({
      ...prev,
      racks: [...prev.racks, newRack],
    }));

    setNewRackName("");
    setNewRackLocation("");
    toast.success("New rack added successfully");
  };

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <Input
                value={dataCenterName}
                onChange={(e) => handleDataCenterNameChange(e.target.value)}
                className="text-2xl font-bold"
                placeholder="Data Center Name"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rack
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Rack</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rack Name</label>
                    <Input
                      value={newRackName}
                      onChange={(e) => setNewRackName(e.target.value)}
                      placeholder="Enter rack name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={newRackLocation}
                      onChange={(e) => setNewRackLocation(e.target.value)}
                      placeholder="Enter rack location"
                    />
                  </div>
                  <Button onClick={handleAddRack}>Add Rack</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

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
                />
              </div>
            ))}
          </div>
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
