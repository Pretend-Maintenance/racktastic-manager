import { useState, useEffect } from "react";
import TransactionLog from "@/components/TransactionLog";
import { LogEntry } from "@/lib/types";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

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
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const exportToCSV = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      csvContent += "Timestamp,User,Action,Item Type,Item Name,Changes\n";
      
      // Add data rows
      logs.forEach(log => {
        const row = [
          new Date(log.timestamp).toLocaleString(),
          log.user,
          log.action,
          log.itemType,
          log.itemName,
          log.changes.map(change => `${change.field}: ${change.oldValue} → ${change.newValue}`).join('; ')
        ].map(cell => `"${cell}"`).join(',');
        
        csvContent += row + "\n";
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `transaction_log_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      toast.success("Transaction log exported successfully");
    } catch (error) {
      console.error("Error exporting transaction log:", error);
      toast.error("Failed to export transaction log");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transaction Log</h1>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>
        <TransactionLog logs={logs} />
      </div>
    </div>
  );
};

export default TransactionLogPage;