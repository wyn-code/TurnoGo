import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { AdminBusiness } from "../../data/adminMockData";

interface DeleteBusinessDialogProps {
  business: AdminBusiness | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteBusinessDialog({ business, open, onOpenChange, onConfirm }: DeleteBusinessDialogProps) {
  if (!business) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar el negocio <span className="font-semibold text-foreground">"{business.businessName}"</span> de{" "}
            <span className="font-semibold text-foreground">{business.ownerFirstName} {business.ownerLastName}</span>.
            <br /><br />
            Esta acción no se puede deshacer. Se eliminarán todos los datos, turnos y configuración asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(business.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, eliminar negocio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
