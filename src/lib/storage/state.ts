import { Location } from "../types";
import { logTransaction } from "./logs";

const STATUS_KEY = "datacenter_status";

export const saveState = (location: Location, action?: string, changes?: any[]) => {
  localStorage.setItem(STATUS_KEY, JSON.stringify(location));
  
  if (action) {
    logTransaction(action, "rack", location.name, changes || []);
  }
};

export const loadState = (): Location | null => {
  const saved = localStorage.getItem(STATUS_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearAllData = () => {
  // Log the clear event before clearing
  logTransaction(
    "cleared",
    "rack",
    "all data",
    [{
      field: "Data",
      oldValue: "All data",
      newValue: "Cleared"
    }]
  );

  // Clear all data except logs
  const logs: Record<string, string | null> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('log_')) {
      logs[key] = localStorage.getItem(key);
    }
  }

  localStorage.clear();

  // Restore logs
  Object.entries(logs).forEach(([key, value]) => {
    if (value) localStorage.setItem(key, value);
  });

  // Initialize with empty state
  const emptyState: Location = {
    id: crypto.randomUUID(),
    name: "Data Center 1",
    racks: []
  };
  
  localStorage.setItem(STATUS_KEY, JSON.stringify(emptyState));
  return emptyState;
};