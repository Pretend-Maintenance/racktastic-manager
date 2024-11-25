export type DeviceType = "server" | "switch" | "firewall" | "storage" | "other";

export interface NetworkAdapter {
  id: string;
  name: string;
  type: "ethernet" | "fiber";
  speed: string;
  port: string;
  connected: boolean;
  connectedToDevice?: string;
  ip?: string;
  vlan?: string;
  customConnection?: string;
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
  assetReference?: string;
  ipAddress?: string;
  macAddress?: string;
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

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  itemType: "device" | "rack" | "networkAdapter";
  itemId: string;
  itemName: string;
  deviceDetails?: {
    type?: string;
    manufacturer?: string;
    model?: string;
    status?: string;
    position?: string;
    height?: string;
  };
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}
