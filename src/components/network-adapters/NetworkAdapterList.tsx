import { NetworkAdapter, Device } from "@/lib/types";
import { NetworkAdapterConnection } from "../NetworkAdapterConnection";

interface NetworkAdapterListProps {
  adapters: NetworkAdapter[];
  onToggleConnection: (id: string, targetDeviceId?: string) => void;
  onRemoveAdapter: (id: string) => void;
  availableDevices: Device[];
  currentDevice?: Device;
  customConnection: string;
  setCustomConnection: (value: string) => void;
}

export const NetworkAdapterList = ({
  adapters,
  onToggleConnection,
  onRemoveAdapter,
  availableDevices,
  currentDevice,
  customConnection,
  setCustomConnection
}: NetworkAdapterListProps) => {
  return (
    <div className="space-y-3">
      {adapters.map((adapter) => (
        <div
          key={adapter.id}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
        >
          <div className="space-y-1">
            <div className="font-medium">{adapter.name}</div>
            <div className="text-sm text-muted-foreground">
              {adapter.type} - {adapter.speed}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Port {adapter.port}</span>
            <NetworkAdapterConnection
              adapter={adapter}
              onToggleConnection={onToggleConnection}
              onRemoveAdapter={onRemoveAdapter}
              availableDevices={availableDevices}
              currentDevice={currentDevice}
              customConnection={customConnection}
              setCustomConnection={setCustomConnection}
            />
          </div>
        </div>
      ))}
    </div>
  );
};