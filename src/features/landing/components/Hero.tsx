import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-background">
      {/* Shapes animadas */}
<div
  aria-hidden
  className="pointer-events-none absolute left-0 top-16 h-24 w-24 rounded-2xl bg-primary/20 blur-sm animate-[slide-in-left_0.9s_ease-out_both] rotate-12"
/>

<div
  aria-hidden
  className="pointer-events-none absolute left-10 bottom-20 h-16 w-16 rounded-full bg-primary/30 animate-[slide-in-left_1.1s_ease-out_0.15s_both]"
/>

<div
  aria-hidden
  className="pointer-events-none absolute left-1/4 top-10 h-10 w-10 rotate-45 bg-accent-foreground/20 animate-[slide-in-left_1.3s_ease-out_0.3s_both]"
/>

<div
  aria-hidden
  className="pointer-events-none absolute right-0 top-24 h-28 w-28 rounded-full bg-primary/15 blur-sm animate-[slide-in-right_0.9s_ease-out_both]"
/>

<div
  aria-hidden
  className="pointer-events-none absolute right-16 bottom-16 h-20 w-20 rounded-3xl bg-primary/25 rotate-12 animate-[slide-in-right_1.1s_ease-out_0.15s_both]"
/>

<div
  aria-hidden
  className="pointer-events-none absolute right-1/4 top-6 h-8 w-8 rotate-45 bg-accent-foreground/25 animate-[slide-in-right_1.3s_ease-out_0.3s_both]"
/>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Reservá turnos online en tus negocios favoritos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            TurnoGo conecta clientes con negocios de servicios. Encontrá peluquerías, barberías, centros de estética y más, y reservá tu turno en segundos.
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