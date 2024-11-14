import { useState, useEffect } from "react";
import TransactionLog from "@/components/TransactionLog";
import { LogEntry } from "@/lib/types";

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
      ];
      setLogs(sampleLogs);
    };

    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction Log</h1>
      <TransactionLog logs={logs} />
    </div>
  );
};

export default TransactionLogPage;