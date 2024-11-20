import { useState, useEffect, useRef } from "react";
import { Device, Location } from "@/lib/types";
import { loadState } from "@/lib/storage";
import { MainNav } from "@/components/MainNav";

const NetworkMapPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
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
    ctx.fillStyle = '#f3f4f6'; // Tailwind gray-100
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const devices = location.racks.flatMap(rack => rack.devices);
    const positions: { [key: string]: { x: number, y: number } } = {};

    // Calculate positions (simple grid layout)
    devices.forEach((device, index) => {
      const cols = Math.ceil(Math.sqrt(devices.length));
      const x = (index % cols) * 200 + 100;
      const y = Math.floor(index / cols) * 150 + 100;
      positions[device.id] = { x, y };

      // Draw device node with a white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 82, y - 32, 164, 64); // Slightly larger white background
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(x - 80, y - 30, 160, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(device.name, x, y);
      ctx.fillText(`${device.type}`, x, y + 20);
    });

    // Draw connections with improved text visibility
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;

    devices.forEach(device => {
      device.networkAdapters.forEach(adapter => {
        if (adapter.connected && adapter.connectedToDevice) {
          const targetDevice = devices.find(d => d.id === adapter.connectedToDevice);
          if (targetDevice) {
            const sourcePos = positions[device.id];
            const targetPos = positions[targetDevice.id];

            ctx.beginPath();
            ctx.moveTo(sourcePos.x, sourcePos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();

            // Draw white background for port text
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;
            const portText = `Port ${adapter.port}`;
            const textMetrics = ctx.measureText(portText);
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(
              midX - textMetrics.width/2 - 4,
              midY - 10,
              textMetrics.width + 8,
              20
            );
            
            // Draw port text
            ctx.fillStyle = '#000000';
            ctx.fillText(portText, midX, midY);
          }
        }
      });
    });
  }, [location]);

  if (!location) return null;

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
    </div>
  );
};

export default NetworkMapPage;