import { useNavigate } from "react-router-dom";
import { usePlanes } from "@/features/membership/hooks/useMembershipQuery";
import { useCrearPreferencia } from "@/features/membership/hooks/useMembershipMutations";
import { useMembership } from "@/features/membership/contexts/MembershipContext";
import { PlanCard } from "@/features/membership/components/PlanCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function SkeletonGrid() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function Planes() {
  const navigate = useNavigate();
  const { data: planes, isLoading, error } = usePlanes();
  const { planActual } = useMembership();
  const { mutateAsync: crearPreferencia, isPending } =
    useCrearPreferencia();

  const handleSubscribe = async (idPlan: number) => {
    try {
      const result = await crearPreferencia(idPlan);
      window.location.href = result.init_point;
    } catch {
      // error handled by mutation toast
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Elegí el plan ideal para tu negocio
        </h1>
        <p className="text-muted-foreground">
          Todos los planes incluyen funcionalidades básicas de gestión.
          Actualizá para acceder a más beneficios.
        </p>
      </div>

      {isLoading && <SkeletonGrid />}

      {error && (
        <div className="text-center">
          <p className="mb-4 text-destructive">
            Error al cargar los planes. Intentalo de nuevo.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !error && planes?.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">
            No hay planes disponibles en este momento.
          </p>
        </div>
      )}

      {!isLoading && planes && planes.length > 0 && (
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {planes.map((plan) => (
            <PlanCard
              key={plan.id_plan}
              plan={plan}
              isCurrentPlan={
                planActual
                  ? plan.nombre.toLowerCase() ===
                    planActual.toLowerCase()
                  : false
              }
              onSubscribe={handleSubscribe}
              subscribing={isPending}
            />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tenés una suscripción activa?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/mi-suscripcion")}
          >
            Ver detalle de mi suscripción
          </Button>
        </p>
      </div>
    </div>
  );
}
