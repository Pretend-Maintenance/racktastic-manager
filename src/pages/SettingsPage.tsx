import { useState, useEffect } from "react"
import { MainNav } from "@/components/MainNav"
import { Button } from "@/components/ui/button"
import { Download, Upload, Trash2, Terminal, Settings2, Database, Shield } from "lucide-react"
import { toast } from "sonner"
import { Location } from "@/lib/types"
import { saveState } from "@/lib/storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

const SettingsPage = () => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  useEffect(() => {
    // Simulate getting last 10 console lines
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
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="backup" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Backup & Restore
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="console" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Console Output
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {consoleLines.map((line, index) => (
                      <div key={index} className="text-sm font-mono">
                        {line}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="system" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                System Information
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Version</h3>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Last Backup</h3>
                    <p className="text-sm text-muted-foreground">Never</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Storage Usage</h3>
                    <p className="text-sm text-muted-foreground">Calculating...</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Browser</h3>
                    <p className="text-sm text-muted-foreground">{navigator.userAgent}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Access Control</h3>
                    <Button variant="outline" className="w-full">
                      Configure Permissions
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Audit Log</h3>
                    <Button variant="outline" className="w-full">
                      View Audit Log
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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
  )
}

export default SettingsPage