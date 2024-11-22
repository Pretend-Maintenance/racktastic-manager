import { Device } from "../types";

export const getDeviceDetails = (device: Device) => ({
  type: device.type,
  manufacturer: device.manufacturer,
  model: device.model,
  status: device.status,
  position: `U${device.position}`,
  height: `${device.height}U`,
});