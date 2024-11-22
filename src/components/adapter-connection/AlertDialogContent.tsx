import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as BaseAlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NetworkAdapter } from "@/lib/types";

interface AlertDialogContentProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  pendingConnection: string | undefined;
  setPendingConnection: (connection: string | undefined) => void;
  adapter: NetworkAdapter;
  onToggleConnection: (id: string, targetDeviceId?: string) => void;
  setSelectedDevice: (device: string | undefined) => void;
}

export const AlertDialogContent = ({
  showDialog,
  setShowDialog,
  pendingConnection,
  setPendingConnection,
  adapter,
  onToggleConnection,
  setSelectedDevice
}: AlertDialogContentProps) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <BaseAlertDialogContent onClick={e => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>No Free Ports Available</AlertDialogTitle>
          <AlertDialogDescription>
            There are no free ports on this device. Would you like to create one and connect the devices?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setShowDialog(false);
            setPendingConnection(undefined);
            setSelectedDevice(adapter.connectedToDevice);
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (pendingConnection) {
              onToggleConnection(adapter.id, pendingConnection);
              setShowDialog(false);
              setPendingConnection(undefined);
            }
          }}>
            Create Port and Connect
          </AlertDialogAction>
        </AlertDialogFooter>
      </BaseAlertDialogContent>
    </AlertDialog>
  );
};