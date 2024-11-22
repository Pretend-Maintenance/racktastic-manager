import { NetworkAdapter } from "@/lib/types";

/**
 * Finds the next free port among the provided network adapters.
 * A free port is defined as one not currently in use (not connected to any device).
 * @param adapters List of network adapters to search through.
 * @returns The first free port as a string, or null if no free ports are found.
 */
export const findNextFreePort = (adapters: NetworkAdapter[]): string | null => {
  console.log("Finding next free port among adapters:", adapters);

  // Sort adapters by port number for consistent and predictable assignment
  const sortedAdapters = [...adapters].sort((a, b) => {
    const portA = parseInt(a.port) || 0; // Parse port as an integer, defaulting to 0
    const portB = parseInt(b.port) || 0;
    return portA - portB; // Sort in ascending order of port numbers
  });

  // Iterate over sorted adapters to find the first free (unused) port
  for (let i = 0; i < sortedAdapters.length; i++) {
    const adapter = sortedAdapters[i];

    // Check if the adapter is not connected and not assigned to any device
    if (!adapter.connected && !adapter.connectedToDevice) {
      console.log(`Found free port: ${adapter.port} on adapter:`, adapter);
      return adapter.port; // Return the port of the first free adapter
    }
  }

  // If no free port is found, return null
  console.log("No free ports found");
  return null;
};

/**
 * Finds the network adapter associated with a specific port.
 * @param adapters List of network adapters to search through.
 * @param port The port to match against adapters.
 * @returns The network adapter associated with the specified port, or undefined if not found.
 */
export const findAdapterByPort = (
  adapters: NetworkAdapter[],
  port: string
): NetworkAdapter | undefined => {
  // Locate the adapter where the port matches the specified value
  const adapter = adapters.find(a => a.port === port);

  if (adapter) {
    console.log(`Found adapter for port ${port}:`, adapter);
  } else {
    console.error(`No adapter found for port: ${port}`);
  }

  return adapter;
};