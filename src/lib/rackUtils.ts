import { Device, Rack } from "./types";

export const isSlotAvailable = (rack: Rack, position: number, deviceHeight: number, excludeDeviceId?: string): boolean => {
  // Check if any other device occupies these slots
  return !rack.devices.some(device => {
    if (device.id === excludeDeviceId) return false;
    
    // Check if there's any overlap between the device's space and the requested space
    const deviceStart = device.position;
    const deviceEnd = device.position + device.height;
    const requestedStart = position;
    const requestedEnd = position + deviceHeight;

    return (deviceStart < requestedEnd) && (requestedStart < deviceEnd);
  });
};