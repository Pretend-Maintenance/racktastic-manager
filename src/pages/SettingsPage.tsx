import { useState } from "react"
import { MainNav } from "@/components/MainNav"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { toast } from "sonner"
import { Location } from "@/lib/types"
import { saveState } from "@/lib/storage"

const SettingsPage = () => {
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
        
        // Reset the file input
        event.target.value = ''
      } catch (error) {
        console.error("Error restoring backup:", error)
        toast.error("Failed to restore backup: Invalid file format")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="bg-card rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Backup & Restore</h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage