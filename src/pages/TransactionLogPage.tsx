import { useState, useEffect } from "react";
import TransactionLog from "@/components/TransactionLog";
import { LogEntry } from "@/lib/types";
import { MainNav } from "@/components/MainNav";

const TransactionLogPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      const allLogs: LogEntry[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('log_')) {
          const logEntry = JSON.parse(localStorage.getItem(key) || '');
          allLogs.push(logEntry);
        }
      }
      // Sort logs by timestamp, newest first
      allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(allLogs);
    };

    fetchLogs();
    
    // Set up an interval to refresh logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    
    return () => clearInterval(interval);
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