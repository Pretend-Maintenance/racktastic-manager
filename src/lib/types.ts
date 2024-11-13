export type DeviceType = "server" | "switch" | "firewall" | "storage" | "other";

export interface NetworkAdapter {
  id: string;
  name: string;
  type: "ethernet" | "fiber";
  speed: string;
  port: number;
  connected: boolean;
  connectedToDevice?: string;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  manufacturer: string;
  model: string;
  height: number;
  position: number;
  networkAdapters: NetworkAdapter[];
  status: "active" | "inactive" | "maintenance";
}

export interface Rack {
  id: string;
  name: string;
  totalU: number;
  devices: Device[];
  location: string;
}

export interface Location {
  id: string;
  name: string;
  racks: Rack[];
}