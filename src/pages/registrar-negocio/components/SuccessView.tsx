import type { FormData } from "../schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type Props = {
  data: FormData;
  navigate: (path: string) => void;
};

export default function SuccessView({ data, navigate }: Props) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                ¡Negocio registrado con éxito!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu negocio <strong>{data.name}</strong> se envió correctamente.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted p-4 text-left">
              <p className="font-medium">Resumen del negocio:</p>
              <p className="text-sm">Categoría: {data.category}</p>
              <p className="text-sm">Whatsapp: {data.whatsapp}</p>
              <p className="text-sm">Ciudad: {data.city}</p>
              <p className="text-sm">Dirección: {data.address}</p>
            </div>

            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
