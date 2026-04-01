import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Tenés un negocio de servicios?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Registrá tu negocio en Turnexo y obtené una página profesional para recibir reservas online. Solo completá un formulario y empezá a recibir clientes.
          </p>

          <Button
            size="lg"
            className="mt-8 gap-2 px-8"
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