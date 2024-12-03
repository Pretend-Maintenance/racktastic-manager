import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SecuritySection = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const handleConfigurePermissions = () => {
    setShowPermissions(true);
    console.log("Opening permissions dialog");
  };

  const handleViewAuditLog = () => {
    setShowAuditLog(true);
    console.log("Opening audit log dialog");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Access Control</h3>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleConfigurePermissions}
        >
          Configure Permissions
        </Button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Audit Log</h3>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewAuditLog}
        >
          View Audit Log
        </Button>
      </div>

      <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Role</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Administrator</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Operator</TableCell>
                  <TableCell>Read & Execute</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Viewer</TableCell>
                  <TableCell>Read Only</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Security Audit Log</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{new Date().toLocaleString()}</TableCell>
                  <TableCell>admin</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Successful authentication</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};