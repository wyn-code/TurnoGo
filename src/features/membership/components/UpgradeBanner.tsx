import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UpgradeBannerProps {
  featureName?: string;
}

export function UpgradeBanner({ featureName }: UpgradeBannerProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {featureName
          ? `Estás en el plan Free. Actualizá al plan VIP para usar "${featureName}".`
          : "Estás en el plan Free. Actualizá para acceder a más funcionalidades."}
      </p>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/planes")}
        >
          Ver planes
        </Button>
      </div>
    </div>
  );
}
