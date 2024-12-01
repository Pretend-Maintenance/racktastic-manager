import { useState, useEffect } from "react"
import { MainNav } from "@/components/MainNav"
import { Button } from "@/components/ui/button"
import { Download, Upload, Trash2, Terminal, Settings2, Database, Shield, Network } from "lucide-react"
import { toast } from "sonner"
import { Location } from "@/lib/types"
import { saveState } from "@/lib/storage"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NetworkScanner } from "@/components/settings/NetworkScanner"
import { BackupSection } from "@/components/settings/BackupSection"
import { ConsoleSection } from "@/components/settings/ConsoleSection"
import { SystemSection } from "@/components/settings/SystemSection"
import { SecuritySection } from "@/components/settings/SecuritySection"

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="network" className="border rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-blue-500" />
                  Network Scanner
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <NetworkScanner />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="backup" className="border rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-500" />
                  Backup & Restore
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <BackupSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="console" className="border rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-blue-500" />
                  Console Output
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <ConsoleSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="system" className="border rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-blue-500" />
                  System Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <SystemSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Security
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <SecuritySection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;