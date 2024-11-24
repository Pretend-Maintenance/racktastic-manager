import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Location } from "@/lib/types";
import { saveState } from "@/lib/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const BackupSection = () => {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleBackupDownload = () => {
    const currentState = localStorage.getItem("datacenter_status")
    if (!currentState) {
      toast.error("No data to backup")
      return
    }

    const backupData = {
      data: JSON.parse(currentState),
      timestamp: new Date().toISOString(),
      version: "1.0"
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `datacenter-backup-${new Date().toISOString()}.cfg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success("Backup file downloaded successfully")
  }

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backupData = JSON.parse(content)
        
        if (!backupData.data || !backupData.timestamp || !backupData.version) {
          throw new Error("Invalid backup file format")
        }

        const location = backupData.data as Location
        saveState(location)
        toast.success("Configuration restored successfully")
        
        event.target.value = ''
      } catch (error) {
        console.error("Error restoring backup:", error)
        toast.error("Failed to restore backup: Invalid file format")
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    localStorage.removeItem("datacenter_status");
    localStorage.removeItem("transaction_log");
    toast.success("All data has been cleared");
    setShowClearDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={handleBackupDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Backup
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".cfg"
            onChange={handleRestore}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Restore Backup
          </Button>
        </div>

        <Button 
          variant="destructive" 
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Data
        </Button>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your data, including device configurations and transaction logs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-destructive">
              Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};