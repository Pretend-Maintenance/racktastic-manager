import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ConsoleSection = () => {
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  useEffect(() => {
    const getLastConsoleLogs = () => {
      const logs = localStorage.getItem('console_logs');
      if (logs) {
        const parsedLogs = JSON.parse(logs);
        setConsoleLines(parsedLogs.slice(-10));
      }
    };
    
    getLastConsoleLogs();
    const interval = setInterval(getLastConsoleLogs, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-2">
        {consoleLines.map((line, index) => (
          <div key={index} className="text-sm font-mono">
            {line}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};