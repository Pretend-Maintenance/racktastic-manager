import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const AuditReportPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSpreadsheetReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Audit & Documentation Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audit Reports Section */}
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                Audit Reports
              </CardTitle>
              <CardDescription>
                Generate and download detailed reports of your rack infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={generateSpreadsheetReport}
                  className="w-full"
                  disabled={isGenerating}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Spreadsheet Report"}
                </Button>
                <div className="text-sm text-muted-foreground">
                  Includes: Device inventory, capacity usage, power consumption
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Section */}
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Documentation
              </CardTitle>
              <CardDescription>
                Manage and access device documentation and maintenance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
                <div className="text-sm text-muted-foreground">
                  Access manuals, maintenance logs, and device specifications
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Control Logs */}
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Security Logs
              </CardTitle>
              <CardDescription>
                Monitor access control and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {/* Placeholder for security logs */}
                  <div className="text-sm">
                    No security events recorded yet
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditReportPage;