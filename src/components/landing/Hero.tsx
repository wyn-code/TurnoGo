import { Button } from "../../components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Reservá turnos online en tus negocios favoritos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Turnexo conecta clientes con negocios de servicios. Encontrá peluquerías, barberías, centros de estética y más, y reservá tu turno en segundos.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8"
              onClick={() => navigate("/negocios")}
            >
              <Search size={18} />
              Explorar negocios
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative blob */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
};

export default Hero;