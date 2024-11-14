import { useState } from "react";
import { Device, Rack, Location } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";
import { MainNav } from "@/components/MainNav";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [newRack, setNewRack] = useState<Partial<Rack>>({
    name: "",
    location: "",
    totalU: 42,
  });

  const handleUpdateRack = (updatedRack: Rack) => {
    const newRacks = location.racks.map(rack =>
      rack.id === updatedRack.id ? updatedRack : rack
    );
    setLocation({ ...location, racks: newRacks });
    setSelectedRack(updatedRack);

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
    setLocation({ ...location, racks: newRacks });
    if (selectedRack.id === rackId) {
      setSelectedRack(newRacks[0]);
    }

    // Log the rack deletion
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Deleted",
      itemType: "rack",
      itemId: rackId,
      itemName: selectedRack.name,
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
  };

  const handleAddRack = () => {
    const newRackComplete: Rack = {
      id: crypto.randomUUID(),
      name: newRack.name || "",
      location: newRack.location || "",
      totalU: newRack.totalU || 42,
      devices: [],
    };

    setLocation({
      ...location,
      racks: [...location.racks, newRackComplete],
    });

    // Log the rack addition
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "Added",
      itemType: "rack",
      itemId: newRackComplete.id,
      itemName: newRackComplete.name,
      changes: [],
    };
    localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));

    setNewRack({
      name: "",
      location: "",
      totalU: 42,
    });
    toast.success("Rack added successfully");
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    const updatedRack = {
      ...selectedRack,
      devices: selectedRack.devices.map(device =>
        device.id === updatedDevice.id ? updatedDevice : device
      ),
    };
    handleUpdateRack(updatedRack);

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
    setSelectedDevice(updatedDevice);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <MainNav />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
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
                <Label htmlFor="name">Rack Name</Label>
                <Input
                  id="name"
                  value={newRack.name}
                  onChange={(e) => setNewRack({ ...newRack, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newRack.location}
                  onChange={(e) => setNewRack({ ...newRack, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="totalU">Total U</Label>
                <Input
                  id="totalU"
                  type="number"
                  value={newRack.totalU}
                  onChange={(e) => setNewRack({ ...newRack, totalU: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddRack}>Add Rack</Button>
            </div>
          </DialogContent>
        </Dialog>
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
          availableDevices={selectedRack.devices}
        />
      )}
    </div>
  );
};

export default Index;