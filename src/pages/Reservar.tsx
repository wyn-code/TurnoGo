import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import BookingForm from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";
import ServiceCard from "@/components/business/ServiceCard";
import ProfessionalCard from "@/components/business/ProfessionalCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { businessService } from "@/services/business.service";
import type { BookingData, Business, Service, Professional } from "@/types";

const STEPS = ["Servicio", "Profesional", "Fecha", "Horario", "Datos", "Confirmar"];

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({
        id: time,
        time,
        available: true,
      });
    }
  }

  return slots;
};

const Reservar = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get("servicio") || "";

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>({
    serviceId: preSelectedService,
    professionalId: "",
    date: null,
    timeSlot: "",
    client: { firstName: "", lastName: "", phone: "", email: "", notes: "" },
  });
  const [confirmed, setConfirmed] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        if (!slug) {
          throw new Error("Slug no recibido");
        }

        setIsLoading(true);
        setError(null);

        const businessData = await businessService.getBusinessBySlug(slug);
        setBusiness(businessData);

        const [servicesData, professionalsData] = await Promise.all([
          businessService.getBusinessServices(businessData.id),
          businessService.getBusinessProfessionals(businessData.id),
        ]);

        setServices(servicesData);
        setProfessionals(professionalsData);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el negocio para reservar");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p>Cargando reserva...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Negocio no encontrado</h1>
          <Button asChild className="mt-4">
            <Link to="/negocios">Ver todos los negocios</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedService = services.find((s) => String(s.id) === String(booking.serviceId));
  const selectedProfessional = professionals.find(
    (p) => String(p.id) === String(booking.professionalId)
  );

  const canNext = (): boolean => {
    switch (step) {
      case 1:
        return !!booking.serviceId;
      case 2:
        return !!booking.professionalId;
      case 3:
        return !!booking.date;
      case 4:
        return !!booking.timeSlot;
      case 5:
        return !!(
          booking.client.firstName &&
          booking.client.lastName &&
          booking.client.phone &&
          booking.client.email
        );
      default:
        return false;
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed && selectedService && selectedProfessional && booking.date) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 py-16">
          <BookingSummary
            service={selectedService}
            professional={selectedProfessional}
            date={booking.date}
            time={booking.timeSlot}
            client={booking.client}
            businessName={business.name}
            confirmed
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-2">
          <Link to={`/negocio/${business.slug}`} className="text-sm text-primary hover:underline">
            ← {business.name}
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-foreground">Reservar turno</h1>

        <div className="mb-8">
          <BookingStepper currentStep={step} steps={STEPS} />
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Elegí un servicio</h2>
              {services.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  selected={String(booking.serviceId) === String(s.id)}
                  onSelect={() => setBooking((b) => ({ ...b, serviceId: String(s.id) }))}
                  showBookButton={false}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Elegí un profesional</h2>
              {professionals.map((p) => (
                <ProfessionalCard
                  key={p.id}
                  professional={p}
                  selected={String(booking.professionalId) === String(p.id)}
                  onSelect={() => setBooking((b) => ({ ...b, professionalId: String(p.id) }))}
                />
              ))}
            </div>
          )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-[18px] font-semibold leading-none text-foreground">
              Elegí una fecha
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seleccioná el día en el que querés reservar tu turno.
            </p>
          </div>

          <div className="mx-auto max-w-[520px] rounded-2xl border border-border bg-card px-6 py-7 shadow-sm">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={booking.date ?? undefined}
                onSelect={(d) =>
                  setBooking((b) => ({
                    ...b,
                    date: d ?? null,
                    timeSlot: "",
                  }))
                }
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return d < today;
                }}
                showOutsideDays
                locale={es}
              />
            </div>

            <div className="mt-7 text-center">
              {booking.date ? (
                <p className="text-[16px] font-medium capitalize text-primary">
                  {format(booking.date, "EEEE, MMMM, yyyy", { locale: es })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Todavía no seleccionaste una fecha.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
          {step === 4 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Elegí un horario</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {timeSlots.map((ts) => (
                  <button
                    key={ts.id}
                    disabled={!ts.available}
                    onClick={() => setBooking((b) => ({ ...b, timeSlot: ts.time }))}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      booking.timeSlot === ts.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : ts.available
                          ? "border-border bg-card text-foreground hover:border-primary/40"
                          : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    )}
                  >
                    {ts.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <BookingForm
              data={booking.client}
              onChange={(client) => setBooking((b) => ({ ...b, client }))}
            />
          )}

          {step === 6 && selectedService && selectedProfessional && booking.date && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Confirmá tu turno</h2>
              <BookingSummary
                service={selectedService}
                professional={selectedProfessional}
                date={booking.date}
                time={booking.timeSlot}
                client={booking.client}
                businessName={business.name}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 1}>
            Atrás
          </Button>

          {step < 6 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleConfirm}>Confirmar turno</Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservar;