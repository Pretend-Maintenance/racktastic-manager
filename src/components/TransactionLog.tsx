import { LogEntry } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface TransactionLogProps {
  logs: LogEntry[];
}

const TransactionLog = ({ logs }: TransactionLogProps) => {
  const renderChangeValue = (change: { field: string; oldValue: string; newValue: string }) => {
    const hasOldValue = change.oldValue && change.oldValue !== "undefined" && change.oldValue !== "null";
    const hasNewValue = change.newValue && change.newValue !== "undefined" && change.newValue !== "null";

    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{change.field}:</span>
        {hasOldValue && <span className="line-through text-red-500">{change.oldValue}</span>}
        {hasOldValue && hasNewValue && <span className="text-muted-foreground">→</span>}
        {hasNewValue && <span className="text-green-500">{change.newValue}</span>}
      </div>
    );
  };

  const renderDeviceDetails = (log: LogEntry) => {
    if (log.itemType === "device") {
      return (
        <div className="mt-2 pl-4 border-l-2 border-muted">
          <p className="text-sm text-muted-foreground">
            Device Details:
          </p>
          <div className="space-y-1">
            {log.deviceDetails && Object.entries(log.deviceDetails).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-muted-foreground">{key}:</span>{" "}
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

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
                  {renderChangeValue(change)}
                </div>
              ))}
            </div>
            {renderDeviceDetails(log)}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TransactionLog;