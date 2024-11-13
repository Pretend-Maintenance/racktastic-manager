import { useState } from "react";
import { Device, Rack } from "@/lib/types";
import RackView from "@/components/RackView";
import DevicePanel from "@/components/DevicePanel";

// Sample data - in a real app this would come from an API
const sampleRack: Rack = {
  id: "rack1",
  name: "Rack A1",
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
};

const Index = () => {
  const [rack, setRack] = useState<Rack>(sampleRack);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleUpdateDevice = (updatedDevice: Device) => {
    const newDevices = rack.devices.map(device =>
      device.id === updatedDevice.id ? updatedDevice : device
    );
    setRack({ ...rack, devices: newDevices });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Data Center Management</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <RackView
            rack={rack}
            onSelectDevice={setSelectedDevice}
            onUpdateRack={setRack}
          />
        </div>
      </div>

      {selectedDevice && (
        <DevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleUpdateDevice}
          availableDevices={rack.devices}
        />
      )}
    </div>
  );
};

export default Index;