import { useState, useEffect } from "react";
import TransactionLog from "@/components/TransactionLog";
import { LogEntry } from "@/lib/types";
import { MainNav } from "@/components/MainNav";

const TransactionLogPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // In a real application, this would fetch from your backend
    const fetchLogs = async () => {
      // Simulated data
      const sampleLogs: LogEntry[] = [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          user: "admin",
          action: "Updated",
          itemType: "device",
          itemId: "dev1",
          itemName: "Web Server 1",
          changes: [
            {
              field: "status",
              oldValue: "inactive",
              newValue: "active",
            },
          ],
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: "admin",
          action: "Added",
          itemType: "rack",
          itemId: "rack2",
          itemName: "Rack B1",
          changes: [
            {
              field: "name",
              oldValue: "",
              newValue: "Rack B1",
            },
          ],
        },
      ];
      setLogs(sampleLogs);
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Transaction Log</h1>
        <TransactionLog logs={logs} />
      </div>
    </div>
  );
};

export default TransactionLogPage;