import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ApiNegocio } from "@/types/api";
import { toast } from "sonner";

interface EditBusinessModalProps {
  business: ApiNegocio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: ApiNegocio) => Promise<void>;
}

const getFormFromBusiness = (business: ApiNegocio | null) => ({
  nombre: business?.nombre ?? "",
  wsp: business?.wsp ?? "",
  telefono: business?.telefono ?? "",
  direccion: business?.direccion ?? "",
  ciudad: business?.ciudad ?? "",
  ig_url: business?.ig_url ?? "",
  activo: business?.activo ?? true,
});

export function EditBusinessModal({ business, open, onOpenChange, onSave }: EditBusinessModalProps) {
  const [form, setForm] = useState(() => getFormFromBusiness(business));

  if (!business) return null;

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.wsp.trim()) {
      toast.error("Nombre del negocio y WhatsApp son obligatorios");
      return;
    }
    await onSave({ ...business, ...form });
    onOpenChange(false);
    toast.success("Negocio actualizado correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Editar negocio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nombre del negocio</Label>
            <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input value={form.wsp} onChange={(e) => setForm({ ...form, wsp: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input value={form.telefono || ""} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input value={form.ig_url || ""} onChange={(e) => setForm({ ...form, ig_url: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={form.activo ? "activo" : "inactivo"} onValueChange={(v) => setForm({ ...form, activo: v === "activo" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
