import type { FormData } from "../schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext"; 

type Props = {
  data: FormData;
  navigate: (path: string) => void;
};

export default function SuccessView({ data, navigate }: Props) {
  const { user } = useAuth();
  const dashboardPath = user?.role?.toLowerCase() === "admin" ? "/admin" : "/dashboard";

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
                Tu negocio <strong>{data.nombre}</strong> se envió correctamente.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted p-4 text-left">
              <p className="font-medium">Resumen del negocio:</p>
              <p className="text-sm">Categoría: {data.id_categoria}</p>
              <p className="text-sm">Whatsapp: {data.wsp}</p>
              <p className="text-sm">Ciudad: {data.ciudad}</p>
              <p className="text-sm">Dirección: {data.direccion}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate(dashboardPath)}>
                Ir a su dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
