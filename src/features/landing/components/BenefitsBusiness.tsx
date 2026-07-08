import { Globe, LayoutDashboard, CalendarPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: CalendarPlus,
    title: "Recibí reservas online",
    description: "Tus clientes pueden reservar turnos las 24 horas, sin necesidad de llamar.",
  },
  {
    icon: Globe,
    title: "Tu página profesional",
    description: "Obtené automáticamente una página con tus servicios, horarios y ubicación.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel de administración",
    description: "Gestioná tus turnos, servicios y clientes desde un panel simple e intuitivo.",
  },
];

const BenefitsBusiness = () => (
  <section className="bg-secondary/50 py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Para negocios
        </h2>
        <p className="mt-3 text-muted-foreground">
          Herramientas pensadas para que tu negocio crezca.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <Card key={b.title} className="border-border bg-card transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsBusiness;
