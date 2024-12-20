import { Device, Rack } from "@/lib/types";
import RackView from "@/components/RackView";
import { AddRackDialog } from "@/components/AddRackDialog";

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
  // Determine grid columns based on number of racks
  const gridClass = racks.length <= 1 
    ? "w-full flex gap-4" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{locationName}</h2>
      <div className={`relative ${gridClass}`}>
        {racks.map((rack) => (
          <div
            key={rack.id}
            className={racks.length <= 1 ? "w-[60%]" : "w-full max-w-xl mx-auto"}
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
        {/* Add Rack button positioned next to the rack */}
        <div className={`flex items-center justify-center min-h-[200px] ${racks.length <= 1 ? "w-[40%]" : "w-full"}`}>
          <AddRackDialog 
            onAddRack={(rackData) => {
              onUpdateRack({
                id: crypto.randomUUID(),
                ...rackData,
                devices: []
              });
            }} 
            existingLocations={Array.from(new Set(racks.map(rack => rack.location)))}
          />
        </div>
      </div>
    </div>
  );
};