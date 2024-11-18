import { LogEntry } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TransactionLogProps {
  logs: LogEntry[];
}

const TransactionLog = ({ logs }: TransactionLogProps) => {
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "created":
        return "bg-green-500";
      case "updated":
        return "bg-blue-500";
      case "deleted":
        return "bg-red-500";
      case "connected":
        return "bg-purple-500";
      case "disconnected":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderChangeValue = (change: { field: string; oldValue: string; newValue: string }) => {
    const hasOldValue = change.oldValue && change.oldValue !== "undefined" && change.oldValue !== "null";
    const hasNewValue = change.newValue && change.newValue !== "undefined" && change.newValue !== "null";

    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-medium">{change.field}:</span>
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
          <p className="text-sm font-medium text-muted-foreground">
            Device Details:
          </p>
          <div className="space-y-1">
            {log.deviceDetails && Object.entries(log.deviceDetails).map(([key, value]) => (
              <div key={key} className="text-sm flex items-center gap-2">
                <span className="text-muted-foreground capitalize">{key}:</span>
                <Badge variant="outline">{value}</Badge>
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
              <div className="flex items-center gap-2">
                <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(log.timestamp), "PPpp")}
                </span>
              </div>
              <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">
                {log.user}
              </span>
            </div>
            <p className="text-sm mb-2">
              <span className="font-medium capitalize">{log.itemType}</span>:{" "}
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