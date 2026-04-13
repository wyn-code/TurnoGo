import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminBusiness } from "../../data/adminMockData";
import { toast } from "sonner";

interface EditBusinessModalProps {
  business: AdminBusiness | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: AdminBusiness) => void;
}

export function EditBusinessModal({ business, open, onOpenChange, onSave }: EditBusinessModalProps) {
  const [form, setForm] = useState({
    businessName: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    category: "",
    primaryColor: "#7c3aed",
    status: "activo" as "activo" | "inactivo",
  });

  useEffect(() => {
    if (business) {
      setForm({
        businessName: business.businessName,
        ownerFirstName: business.ownerFirstName,
        ownerLastName: business.ownerLastName,
        ownerEmail: business.ownerEmail,
        category: business.category,
        primaryColor: business.primaryColor || "#7c3aed",
        status: business.status,
      });
    }
  }, [business]);

  if (!business) return null;

  const handleSave = () => {
    if (!form.businessName.trim() || !form.ownerEmail.trim()) {
      toast.error("Nombre del negocio y email son obligatorios");
      return;
    }
    onSave({ ...business, ...form });
    onOpenChange(false);
    toast.success("Negocio actualizado correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Editar negocio</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="apariencia" className="flex-1">Apariencia</TabsTrigger>
            <TabsTrigger value="config" className="flex-1">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nombre del negocio</Label>
              <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre del dueño</Label>
                <Input value={form.ownerFirstName} onChange={(e) => setForm({ ...form, ownerFirstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Apellido del dueño</Label>
                <Input value={form.ownerLastName} onChange={(e) => setForm({ ...form, ownerLastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </TabsContent>

          <TabsContent value="apariencia" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Color principal</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-md border border-input"
                />
                <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground text-xs">
                  Sin logo
                </div>
                <Button variant="outline" size="sm">Subir logo</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "activo" | "inactivo" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-border p-4 space-y-2">
              <p className="text-sm font-medium">Turnos totales</p>
              <p className="text-2xl font-bold text-primary">{business.totalAppointments}</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
