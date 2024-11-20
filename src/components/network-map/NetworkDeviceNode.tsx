import { Device } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface NetworkDeviceNodeProps {
  device: Device;
  connectedDevices: Device[];
}

export const NetworkDeviceNode = ({ device, connectedDevices }: NetworkDeviceNodeProps) => {
  const getConnectedDeviceNames = () => {
    const connections = device.networkAdapters
      .filter(adapter => adapter.connected && adapter.connectedToDevice)
      .map(adapter => {
        const connectedDevice = connectedDevices.find(d => d.id === adapter.connectedToDevice);
        if (!connectedDevice) return null;
        
        const connectedPort = connectedDevice.networkAdapters.find(
          a => a.connectedToDevice === device.id
        );
        
        return {
          deviceName: connectedDevice.name,
          sourcePort: adapter.port,
          targetPort: connectedPort?.port || 'unknown'
        };
      })
      .filter(Boolean);

    return connections;
  };

  const connections = getConnectedDeviceNames();

  return (
    <Card className="p-4 w-[300px]">
      <h3 className="text-lg font-semibold mb-2">{device.name}</h3>
      <div className="text-sm text-muted-foreground mb-2">
        {device.type} - {device.manufacturer} {device.model}
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Connected Ports:</h4>
        {connections.length > 0 ? (
          <ul className="space-y-1">
            {connections.map((connection, index) => (
              <li key={index} className="text-sm">
                Port {connection.sourcePort} → {connection.deviceName} (Port {connection.targetPort})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No active connections</p>
        )}
      </div>
    </Card>
  );
};