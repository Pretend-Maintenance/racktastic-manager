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
            <AccordionItem value="network" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Network Scanner
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <NetworkScanner />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="backup" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Backup & Restore
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <BackupSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="console" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Console Output
              </AccordionTrigger>
              <AccordionContent>
                <ConsoleSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="system" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                System Information
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <SystemSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border rounded-lg p-2">
              <AccordionTrigger className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
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