import { NetworkAdapter } from "@/lib/types";

export const findNextFreePort = (adapters: NetworkAdapter[]): string | null => {
  console.log("Finding next free port among adapters:", adapters);
  
  // Sort adapters by port number for consistent assignment
  const sortedAdapters = [...adapters].sort((a, b) => {
    const portA = parseInt(a.port) || 0;
    const portB = parseInt(b.port) || 0;
    return portA - portB;
  });

  // Find the first unused port
  for (let i = 0; i < sortedAdapters.length; i++) {
    const adapter = sortedAdapters[i];
    if (!adapter.connected && !adapter.connectedToDevice) {
      console.log(`Found free port: ${adapter.port} on adapter:`, adapter);
      return adapter.port;
    }
  }
  
  console.log("No free ports found");
  return null;
};

export const findAdapterByPort = (adapters: NetworkAdapter[], port: string): NetworkAdapter | undefined => {
  return adapters.find(a => a.port === port);
};