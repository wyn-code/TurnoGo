import type { ReactNode } from "react";
import { useMembership } from "@/features/membership/contexts/MembershipContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureGuardProps {
  featureKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGuard({
  featureKey,
  children,
  fallback,
}: FeatureGuardProps) {
  const { tieneFuncion, loading } = useMembership();
  const navigate = useNavigate();

  if (loading) return null;

  if (tieneFuncion(featureKey)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Actualizá tu plan para acceder a esta función
      </p>
      <Button
        variant="default"
        size="sm"
        onClick={() => navigate("/planes")}
      >
        Ver planes
      </Button>
    </div>
  );
}
