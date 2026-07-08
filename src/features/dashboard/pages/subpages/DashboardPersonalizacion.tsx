import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Palette, Image, Star, Megaphone, LayoutGrid, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMembership } from "@/features/membership/contexts/MembershipContext";
import { FeatureGuard } from "@/features/membership/components/FeatureGuard";


const premiumFeatures = [
  { icon: Palette, label: "Cambiar colores de marca" },
  { icon: Image, label: "Elegir estilo de portada" },
  { icon: LayoutGrid, label: "Agregar más galerías" },
  { icon: Megaphone, label: "Destacar promociones" },
  { icon: Star, label: "Agregar secciones extra" },
];

const standardFeatures = [
  "Página pública del negocio",
  "Reservas online",
  "Gestión de turnos",
  "Panel de administración",
];

const DashboardPersonalizacion = () => {
  const { planActual, funciones } = useMembership();
  const navigate = useNavigate();

  const tienePremium = funciones?.includes("imagenes_personalizadas");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Personalización</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {planActual ?? "Gratuito"}
              </h3>
              <Badge variant="secondary">Actual</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {tienePremium
                ? "Disfrutá de todas las herramientas de personalización."
                : "Actualizá tu plan para acceder a más herramientas."}
            </p>
            <ul className="space-y-2">
              {standardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <Check size={14} className="text-primary" /> {f}
                </li>
              ))}
              <FeatureGuard featureKey="imagenes_personalizadas">
                {premiumFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm text-foreground">
                    <f.icon size={14} className="text-primary" /> {f.label}
                  </li>
                ))}
              </FeatureGuard>
            </ul>
            {!tienePremium && (
              <Button className="w-full" onClick={() => navigate("/planes")}>
                <ArrowUp size={14} className="mr-2" /> Mejorar plan
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className={tienePremium ? "" : "border-primary ring-2 ring-primary/20"}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Personalización Premium</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Diferenciá tu negocio con herramientas exclusivas.
            </p>
            <ul className="space-y-2">
              {premiumFeatures.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-foreground">
                  <f.icon size={14} className="text-primary" /> {f.label}
                </li>
              ))}
            </ul>
            {tienePremium ? (
              <Badge variant="secondary" className="w-full justify-center py-2">
                <Check size={14} className="mr-1" /> Incluido en tu plan
              </Badge>
            ) : (
              <Button className="w-full" onClick={() => navigate("/planes")}>
                <Crown size={14} className="mr-2" /> Actualizar plan
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPersonalizacion;
