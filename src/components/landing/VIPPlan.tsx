import { Button } from "../../components/ui/button";
import { Crown, Check, Sparkles } from "lucide-react";

const perks = [
  "Personalización avanzada de tu página",
  "Prioridad en los resultados de búsqueda",
  "Estadísticas detalladas de reservas",
  "Soporte prioritario",
  "Recordatorios automáticos para clientes",
];

const VIPPlan = () => (
  <section className="bg-background py-16 sm:py-24 overflow-hidden">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan VIP <Sparkles className="text-amber-400" size={24} />
        </h2>
        <p className="mt-3 text-muted-foreground">
          Llevá tu negocio al siguiente nivel con nuestra membresía premium.
        </p>
      </div>

      {/* Contenedor del Card con efecto de brillo (Glow) */}
      <div className="group relative mx-auto mt-12 max-w-lg">
        
        {/* Efecto de borde difuminado animado detrás de la tarjeta */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-primary opacity-30 blur transition duration-500 group-hover:opacity-60"></div>
        
        {/* Card Principal */}
        <div className="relative rounded-2xl border border-border/50 bg-card p-8 shadow-xl sm:p-10">
          
          {/* Badge superior */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-violet-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
            Más elegido
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Crown size={36} className="text-primary drop-shadow-sm" />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-3xl font-extrabold text-transparent">
              VIP
            </span>
          </div>
          
          <ul className="mt-8 space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-foreground">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check size={14} className="shrink-0 text-primary" />
                </div>
                <span className="text-sm font-medium">{perk}</span>
              </li>
            ))}
          </ul>
          
          {/* Botón CTA con gradiente */}
          <Button 
            size="lg" 
            className="mt-8 w-full gap-2 border-0 bg-gradient-to-r from-primary to-violet-600 text-[15px] shadow-md transition-all hover:from-primary/90 hover:to-violet-600/90 active:scale-95"
          >
            <Crown size={18} />
            Quiero ser VIP
          </Button>
        </div>
      </div>

    </div>
  </section>
);

export default VIPPlan;