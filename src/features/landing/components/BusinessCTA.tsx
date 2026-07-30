import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-secondary/50 py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-8 text-center shadow-lg transition-shadow hover:shadow-xl sm:p-12">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground shadow-sm">
            Para dueños de negocio
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Tenés un negocio de servicios?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Registrá tu negocio en TurnoGo y obtené una página profesional para recibir reservas online. Solo completá un formulario y empezá a recibir clientes.
          </p>

          <Button
            size="lg"
            className="mt-8 gap-2 px-8 transition-all active:scale-95"
            onClick={() => navigate("/registro")}
          >
            Registrar mi negocio
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;