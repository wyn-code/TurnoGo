import { Search, ListChecks, CalendarCheck } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Encontrá un negocio",
    description: "Buscá por nombre, categoría o ubicación.",
  },
  {
    number: 2,
    icon: ListChecks,
    title: "Elegí un servicio",
    description: "Revisá los servicios disponibles y sus precios.",
  },
  {
    number: 3,
    icon: CalendarCheck,
    title: "Reservá tu turno",
    description: "Seleccioná fecha y hora, y confirmá tu reserva.",
  },
];

const HowItWorks = () => (
  <section className="bg-background py-16 sm:py-24 overflow-hidden">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center" data-scroll-reveal>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ¿Cómo funciona?
        </h2>
        <p className="mt-3 text-muted-foreground">Reservá un turno en 3 simples pasos.</p>
      </div>
      <div className="relative mt-12 grid gap-10 sm:grid-cols-3" data-scroll-reveal>
        {steps.map((s) => (
          <div key={s.number} className="fade-in flex flex-col items-center text-center">
            <div className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
              <s.icon size={28} />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background transition-transform group-hover:scale-110">
                {s.number}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
