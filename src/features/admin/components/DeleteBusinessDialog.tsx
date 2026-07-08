import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { ApiNegocio } from "@/types/api";

interface DeleteBusinessDialogProps {
  business: ApiNegocio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteBusinessDialog({ business, open, onOpenChange, onConfirm }: DeleteBusinessDialogProps) {
  if (!business) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar el negocio <span className="font-semibold text-foreground">"{business.nombre}"</span> ubicado en{" "}
            <span className="font-semibold text-foreground">{business.ciudad}</span>.
            <br /><br />
            Esta acción no se puede deshacer. Se eliminarán todos los datos, turnos y configuración asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, eliminar negocio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
