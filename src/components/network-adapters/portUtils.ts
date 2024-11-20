import { NetworkAdapter } from "@/lib/types";

export const findNextFreePort = (adapters: NetworkAdapter[]): string | null => {
  const usedPorts = new Set(adapters.filter(a => a.connected).map(a => a.port));
  const allPorts = adapters.map(a => a.port);
  
  // First try to find an existing free port
  const existingFreePort = allPorts.find(port => !usedPorts.has(port));
  if (existingFreePort) return existingFreePort;
  
  return null;
};