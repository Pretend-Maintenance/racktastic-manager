import { LogEntry } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface TransactionLogProps {
  logs: LogEntry[];
}

const TransactionLog = ({ logs }: TransactionLogProps) => {
  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {format(new Date(log.timestamp), "PPpp")}
              </span>
              <span className="text-sm font-medium">{log.user}</span>
            </div>
            <p className="text-sm mb-2">
              <span className="font-medium">{log.action}</span> on {log.itemType}{" "}
              <span className="font-medium">{log.itemName}</span>
            </p>
            <div className="space-y-1">
              {log.changes.map((change, index) => (
                <div key={index} className="text-sm">
                  <span className="text-muted-foreground">{change.field}:</span>{" "}
                  <span className="line-through text-red-500">{change.oldValue}</span>{" "}
                  <span className="text-green-500">{change.newValue}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TransactionLog;