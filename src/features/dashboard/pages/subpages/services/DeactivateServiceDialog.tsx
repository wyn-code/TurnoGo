import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { ApiServicio } from "@/types/api";

interface DeactivateServiceDialogProps {
  service: ApiServicio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function DeactivateServiceDialog({
  service,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeactivateServiceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar servicio?</AlertDialogTitle>

          <AlertDialogDescription>
            {service ? (
              <>
                <span className="font-semibold text-foreground">
                  &quot;{service.nombre_servicio}&quot;
                </span>{" "}
                dejará de mostrarse y no se podrá reservar. Podés reactivarlo
                cuando quieras desde &quot;Ver inactivos&quot;.
              </>
            ) : (
              "El servicio dejará de estar disponible para reservas."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            disabled={isLoading || !service}
            onClick={() => void onConfirm()}
          >
            {isLoading ? "Desactivando..." : "Desactivar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
