import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const DashboardConfiguracion = () => {
  const [data, setData] = useState({
    nombre: "Barbería Don Carlos",
    descripcion: "Cortes clásicos y modernos con la mejor atención.",
    telefono: "+54 11 4567-8901",
    wsp: "+5491145678901",
    ig_url: "@barberiadoncarlos",
    direccion: "Av. Corrientes 1234",
    ciudad: "CABA",
    url_fb: "",
  });

  const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Configuración del negocio</h2>
        <Button size="sm" onClick={() => toast.success("Configuración guardada (mock)")}>Guardar</Button>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label>Nombre del negocio</Label>
            <Input value={data.nombre} onChange={(e) => update("nombre", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea value={data.descripcion} onChange={(e) => update("descripcion", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={data.telefono} onChange={(e) => update("telefono", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={data.wsp} onChange={(e) => update("wsp", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={data.ig_url} onChange={(e) => update("ig_url", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input value={data.url_fb} onChange={(e) => update("url_fb", e.target.value)} placeholder="https://facebook.com/tunegocio" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input value={data.direccion} onChange={(e) => update("direccion", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input value={data.ciudad} onChange={(e) => update("ciudad", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracion;
