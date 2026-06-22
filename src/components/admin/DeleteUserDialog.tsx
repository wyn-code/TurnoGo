import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ApiUsuario } from "@/types/api";

interface DeleteUserDialogProps {
  user: ApiUsuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: DeleteUserDialogProps) {
  if (!user) return null;


  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar la cuenta de{" "}
            <span className="font-semibold text-foreground">{user.usuario_us}</span> (
            {user.email_us}). Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, eliminar usuario
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
