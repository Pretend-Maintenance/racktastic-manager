import { Location, Device, Rack } from "./types";

const STORAGE_KEY = "datacenter_state";

export const saveState = (location: Location) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
};

export const loadState = (): Location | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};