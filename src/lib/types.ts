export type DeviceType = "server" | "switch" | "firewall" | "storage" | "other";

export interface NetworkAdapter {
  id: string;
  name: string;
  type: "ethernet" | "fiber";
  speed: string;
  port: string; // Changed from number to string since we're using string input
  connected: boolean;
  connectedToDevice?: string;
  ip?: string;
  vlan?: string;
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
