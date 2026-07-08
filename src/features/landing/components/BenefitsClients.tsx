import { MapPin, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: MapPin,
    title: "Encontrá negocios cerca",
    description: "Buscá por ubicación o categoría y descubrí los mejores negocios de servicios cerca tuyo.",
  },
  {
    icon: CalendarCheck,
    title: "Reservá turnos fácilmente",
    description: "Elegí el día, la hora y el servicio que necesitás. Sin llamadas, sin esperas.",
  },
  {
    icon: Clock,
    title: "Disponibilidad en tiempo real",
    description: "Consultá la agenda actualizada de cada negocio y reservá solo horarios disponibles.",
  },
];

const BenefitsClients = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Para clientes
        </h2>
        <p className="mt-3 text-muted-foreground">
          Todo lo que necesitás para reservar turnos de forma simple.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <Card key={b.title} className="border-border bg-card transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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

export default BenefitsClients;
