import { useEffect, useState } from "react";

export const SystemSection = () => {
  const [storageUsage, setStorageUsage] = useState<string>("Calculating...");
  
  useEffect(() => {
    const calculateStorageUsage = () => {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length * 2; // Approximate size in bytes
        }
      }
      return (total / 1024).toFixed(2) + " KB";
    };
    
    setStorageUsage(calculateStorageUsage());
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold">Version</h3>
        <p className="text-sm text-muted-foreground">1.0.0</p>
      </div>
      <div>
        <h3 className="font-semibold">Storage Usage</h3>
        <p className="text-sm text-muted-foreground">{storageUsage}</p>
      </div>
      <div>
        <h3 className="font-semibold">Browser</h3>
        <p className="text-sm text-muted-foreground">{navigator.userAgent}</p>
      </div>
    </div>
  );
};