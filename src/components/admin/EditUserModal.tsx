/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiUsuario } from "@/types/api";
import { toast } from "sonner";

interface EditUserModalProps {
  user: ApiUsuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: ApiUsuario) => Promise<void>;
}

const getFormFromUser = (user: ApiUsuario | null) => ({
  usuario_us: user?.usuario_us ?? "",
  email_us: user?.email_us ?? "",
  role_us: user?.role_us ?? user?.rol ?? "duenio",
  estado: user?.estado ?? true,
});

export function EditUserModal({
  user,
  open,
  onOpenChange,
  onSave,
}: EditUserModalProps) {
  const [form, setForm] = useState(getFormFromUser(user));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(getFormFromUser(user));
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (
      !form.usuario_us.trim() ||
      !form.email_us.trim()
    ) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        ...user,
        ...form,
      });
      onOpenChange(false);
    } catch {
      // El error ya se maneja en el componente padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              
            </div>
            <div className="space-y-2">
              
            </div>
          </div>

          <div className="space-y-2">
            <Label>Usuario</Label>
            <Input
              value={form.usuario_us}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, usuario_us: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email_us}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email_us: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Rol</Label>
            <Select
              value={form.role_us}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, role_us: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="duenio">Dueño de negocio</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={form.estado ? "habilitado" : "deshabilitado"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  habilitado: value === "habilitado",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="habilitado">Habilitado</SelectItem>
                <SelectItem value="deshabilitado">Deshabilitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
