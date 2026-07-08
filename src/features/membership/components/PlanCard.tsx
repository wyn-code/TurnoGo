import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { ApiPlan } from "@/types/api";

interface PlanCardProps {
  plan: ApiPlan;
  isCurrentPlan?: boolean;
  onSubscribe?: (idPlan: number) => void;
  subscribing?: boolean;
}

const FEATURE_LABELS: Record<string, string> = {
  mapa_ubicacion: "Mapa de ubicación",
  imagenes_personalizadas: "Imágenes personalizadas",
  soporte_prioritario: "Soporte prioritario",
};

const FREE_FEATURES = [
  "Gestión de turnos",
  "Perfil de negocio público",
  "Servicios y empleados",
];

const PAID_FEATURE_KEYS = Object.keys(FEATURE_LABELS);

export function PlanCard({
  plan,
  isCurrentPlan,
  onSubscribe,
  subscribing,
}: PlanCardProps) {
  const isFree = plan.precio === 0;
  const planFeatureKeys = plan.feature_keys ?? [];

  return (
    <Card
      className={`relative flex flex-col transition-shadow hover:shadow-lg ${
        isCurrentPlan ? "border-2 border-primary" : ""
      }`}
    >
      {isCurrentPlan && (
        <Badge className="absolute right-3 top-3">Plan actual</Badge>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{plan.nombre}</CardTitle>
        <CardDescription>{plan.descripcion}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {isFree
              ? "Gratis"
              : `$${plan.precio.toLocaleString("es-AR")}`}
          </span>
          {!isFree && (
            <span className="text-sm text-muted-foreground">/mes</span>
          )}
        </div>

        <ul className="space-y-2">
          {isFree
            ? FREE_FEATURES.map((label) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span>{label}</span>
                </li>
              ))
            : PAID_FEATURE_KEYS.map((key) => {
                const included = planFeatureKeys.includes(key);
                return (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    {included ? (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={included ? "" : "text-muted-foreground"}>
                      {FEATURE_LABELS[key]}
                    </span>
                  </li>
                );
              })}
        </ul>
      </CardContent>

      {!isFree && (
        <CardFooter>
          <Button
            className="w-full"
            variant={isCurrentPlan ? "outline" : "default"}
            disabled={isCurrentPlan || subscribing}
            onClick={() => onSubscribe?.(plan.id_plan)}
          >
            {isCurrentPlan
              ? "Plan actual"
              : subscribing
                ? "Procesando..."
                : "Suscribirse"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
