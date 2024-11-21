import { useState, useEffect, useRef } from "react";
import { Device, Location, LogEntry } from "@/lib/types";
import { loadState, getDeviceLogs } from "@/lib/storage";
import { MainNav } from "@/components/MainNav";
import DevicePanel from "@/components/DevicePanel";

const NetworkMapPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setLocation(savedState);
    }
  }, []);

  useEffect(() => {
    if (!location || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;

    // Clear canvas with a light gray background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const devices = location.racks.flatMap(rack => rack.devices);
    const positions: { [key: string]: { x: number, y: number } } = {};

    // Calculate positions (simple grid layout)
    devices.forEach((device, index) => {
      const cols = Math.ceil(Math.sqrt(devices.length));
      const x = (index % cols) * 200 + 100;
      const y = Math.floor(index / cols) * 150 + 100;
      positions[device.id] = { x, y };

      // Draw clickable device node
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 82, y - 32, 164, 64);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(x - 80, y - 30, 160, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(device.name, x, y);
      ctx.fillText(`${device.type}`, x, y + 20);
    });

    // Draw connections with port labels
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;

    devices.forEach(device => {
      device.networkAdapters.forEach(adapter => {
        if (adapter.connected && adapter.connectedToDevice && adapter.connectedToDevice !== "custom") {
          const targetDevice = devices.find(d => d.id === adapter.connectedToDevice);
          if (targetDevice) {
            const sourcePos = positions[device.id];
            const targetPos = positions[targetDevice.id];

            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(sourcePos.x, sourcePos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();

            // Calculate midpoint for port labels
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;

            // Find connected port on target device
            const targetAdapter = targetDevice.networkAdapters.find(
              a => a.connectedToDevice === device.id
            );

            // Draw port labels with white background
            const portText = `${device.name} Port ${adapter.port} → ${targetDevice.name} Port ${targetAdapter?.port || '?'}`;
            const textMetrics = ctx.measureText(portText);
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(
              midX - textMetrics.width/2 - 4,
              midY - 10,
              textMetrics.width + 8,
              20
            );
            
            ctx.fillStyle = '#000000';
            ctx.fillText(portText, midX, midY);
          }
        }
      });
    });

    // Add click handler for devices
    canvas.onclick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if click is within any device box
      devices.forEach((device) => {
        const pos = positions[device.id];
        if (pos && 
            x >= pos.x - 80 && x <= pos.x + 80 &&
            y >= pos.y - 30 && y <= pos.y + 30) {
          setSelectedDevice(device);
        }
      });
    };

    return () => {
      canvas.onclick = null;
    };
  }, [location, selectedDevice]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-2xl font-bold mb-6">Network Connection Map</h1>
          <div className="bg-card rounded-lg p-6 border">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      </div>

      {selectedDevice && (
        <DevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={(updatedDevice) => {
            if (!location) return;
            
            const newLocation = {
              ...location,
              racks: location.racks.map(rack => ({
                ...rack,
                devices: rack.devices.map(d => 
                  d.id === updatedDevice.id ? updatedDevice : d
                )
              }))
            };
            
            setLocation(newLocation);
            setSelectedDevice(updatedDevice);
          }}
          onDelete={(deviceId) => {
            if (!location) return;
            
            const newLocation = {
              ...location,
              racks: location.racks.map(rack => ({
                ...rack,
                devices: rack.devices.filter(d => d.id !== deviceId)
              }))
            };
            
            setLocation(newLocation);
            setSelectedDevice(null);
          }}
          availableDevices={location.racks.flatMap(rack => rack.devices)}
        />
      )}
    </div>
  );
};

export default NetworkMapPage;