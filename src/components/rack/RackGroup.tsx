import { Device, Rack } from "@/lib/types";
import RackView from "@/components/RackView";

interface RackGroupProps {
  locationName: string;
  racks: Rack[];
  onSelectRack: (rack: Rack) => void;
  onSelectDevice: (device: Device | null) => void;
  onUpdateRack: (rack: Rack) => void;
  onDeleteRack: (rackId: string) => void;
}

export const RackGroup = ({
  locationName,
  racks,
  onSelectRack,
  onSelectDevice,
  onUpdateRack,
  onDeleteRack
}: RackGroupProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{locationName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {racks.map((rack) => (
          <div
            key={rack.id}
            className="cursor-pointer"
            onClick={() => onSelectRack(rack)}
          >
            <RackView
              rack={rack}
              onSelectDevice={onSelectDevice}
              onUpdateRack={onUpdateRack}
              onDeleteRack={onDeleteRack}
            />
          </div>
        ))}
      </div>
    </div>
  );
};