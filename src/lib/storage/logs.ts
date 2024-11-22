import { LogEntry } from "../types";
import { getDeviceDetails } from "./deviceDetails";
import { Device } from "../types";

export const getDeviceLogs = (deviceId: string): LogEntry[] => {
  console.log("Fetching logs for device:", deviceId);
  
  const logs: LogEntry[] = [];
  // Iterate through localStorage to find logs related to this device
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Fix the TypeScript error by properly type checking the key
    if (typeof key === 'string' && key.startsWith('log_')) {
      const logEntry = JSON.parse(localStorage.getItem(key) || '{}');
      if (logEntry.deviceDetails) {
        logs.push(logEntry);
      }
    }
  }
  
  // Sort logs by timestamp in descending order (newest first)
  return logs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const logTransaction = (
  action: string, 
  itemType: "device" | "rack" | "networkAdapter", 
  itemName: string, 
  changes: any[] = [], 
  device?: Device
) => {
  console.log("Logging transaction:", { action, itemType, itemName, changes, device });
  
  const logEntry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: "admin",
    action,
    itemType,
    itemId: crypto.randomUUID(),
    itemName,
    changes,
  };

  if (device) {
    logEntry.deviceDetails = getDeviceDetails(device);
  }
  
  localStorage.setItem(`log_${logEntry.id}`, JSON.stringify(logEntry));
};