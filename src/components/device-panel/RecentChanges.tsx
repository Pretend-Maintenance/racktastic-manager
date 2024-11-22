import { LogEntry } from "@/lib/types";
import { History } from "lucide-react";
import { format } from "date-fns";

interface RecentChangesProps {
  changes: LogEntry[];
}

export const RecentChanges = ({ changes }: RecentChangesProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <History className="h-4 w-4" />
        Recent Changes
      </h3>
      <div className="space-y-3">
        {changes.map((log) => (
          <div key={log.id} className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{log.action}</span>
              <span className="text-muted-foreground">
                {format(new Date(log.timestamp), "MMM d, HH:mm")}
              </span>
            </div>
            <div className="text-sm mt-1">
              {log.changes.map((change, idx) => (
                <div key={idx} className="text-muted-foreground">
                  {change.field}: {change.oldValue} → {change.newValue}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};