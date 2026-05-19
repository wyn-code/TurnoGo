import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { appointmentService } from "@/services/appointment.service";
import { businessService } from "@/services/business.service";
import { clientService } from "@/services/cliente.service";

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
import type {
  BookingData,
  ApiNegocio,
  ApiServicio,
  ApiEmpleado,
  ApiTurno,
} from "@/types/api";
import { ApiError } from "@/lib/api-client";

// --- CAMBIO: Se redujeron los pasos, fusionando Servicio y Profesional ---
const STEPS = [
  "Servicio",
  "Fecha",
  "Horario",
  "Datos",
  "Confirmar",
  "Completado",
];

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

const pad = (value: number) => String(value).padStart(2, "0");

const toLocalDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

const rangesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date) => {
  return startA < endB && endA > startB;
};

const buildLocalDateTimeString = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}T${time}:00`;
};

const generateTimeSlots = (
  selectedDate: Date | null,
  occupiedAppointments: ApiTurno[],
  durationMinutes: number,
): TimeSlot[] => {
  if (!selectedDate) return [];

  const slots: TimeSlot[] = [];
  const now = new Date();

  // Horario laboral
  const openingHour = 9;
  const closingHour = 18;

  // Inicio del día laboral
  const dayStart = new Date(selectedDate);
  dayStart.setHours(openingHour, 0, 0, 0);

  // Fin del día laboral
  const dayEnd = new Date(selectedDate);
  dayEnd.setHours(closingHour, 0, 0, 0);

  // Cursor dinámico
  let currentSlotStart = new Date(dayStart);

  while (true) {
    const currentSlotEnd = addMinutes(currentSlotStart, durationMinutes);

    // Si el turno termina después del cierre, no mostrarlo
    if (currentSlotEnd > dayEnd) break;

    const hours = pad(currentSlotStart.getHours());
    const minutes = pad(currentSlotStart.getMinutes());
    const time = `${hours}:${minutes}`;

    // Bloquear horarios pasados
    const isPast = currentSlotStart <= now;

    // Verificar solapamientos
    const isOccupied = occupiedAppointments.some((turno) => {
      if (!turno.fecha_hora_inicio || !turno.fecha_hora_fin) return false;

      const bookedStart = new Date(turno.fecha_hora_inicio);
      const bookedEnd = new Date(turno.fecha_hora_fin);

      return rangesOverlap(
        currentSlotStart,
        currentSlotEnd,
        bookedStart,
        bookedEnd,
      );
    });

    slots.push({
      id: time,
      time,
      available: !isPast && !isOccupied,
    });

    // Avanza dinámicamente según duración real
    currentSlotStart = addMinutes(currentSlotStart, durationMinutes);
  }

  return slots;
};

const Reservar = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get("servicio") || "";

  const [business, setBusiness] = useState<ApiNegocio | null>(null);
  const [services, setServices] = useState<ApiServicio[]>([]);
  const [professionals, setProfessionals] = useState<ApiEmpleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>({
    serviceId: preSelectedService,
    professionalId: "",
    date: null,
    timeSlot: "",
    client: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const [occupiedAppointments, setOccupiedAppointments] = useState<ApiTurno[]>([]);
  const [occupiedDays, setOccupiedDays] = useState<Set<string>>(new Set());
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        if (!slug) throw new Error("Slug no recibido");

        setIsLoading(true);
        setError(null);

        const businessData = await businessService.getBusinessBySlug(slug);
        setBusiness(businessData);

        const [servicesData, professionalsData] = await Promise.all([
          businessService.getBusinessServices(businessData.id_negocio),
          businessService.getBusinessProfessionals(businessData.id_negocio),
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

  const selectedService = services.find(
    (service) => String(service.id_servicio) === String(booking.serviceId),
  );

  const selectedProfessional = professionals.find(
    (professional) =>
      String(professional.id_empleado) === String(booking.professionalId),
  );

  const serviceDuration = selectedService?.duracion_min ?? 30;

  const timeSlots = useMemo(
    () =>
      generateTimeSlots(
        booking.date,
        occupiedAppointments,
        serviceDuration,
      ),
    [booking.date, occupiedAppointments, serviceDuration],
  );
  const availableSlots = timeSlots.filter((slot) => slot.available);

  const effectiveSelectedTime =
    booking.timeSlot ||
    (availableSlots.length === 1 ? availableSlots[0].time : "");

  const refreshOccupiedAppointments = useCallback(async () => {
    if (!business || !booking.date) {
      setOccupiedAppointments([]);
      return;
    }

    try {
      setIsLoadingSlots(true);
      const from = new Date(booking.date);
      from.setHours(0, 0, 0, 0);

      const to = new Date(booking.date);
      to.setHours(23, 59, 59, 999);

      const response = await appointmentService.getAppointmentsByRange({
        id_negocio: String(business.id_negocio),
        desde: from.toISOString(),
        hasta: to.toISOString(),
        ...(booking.professionalId && {
          id_empleado: String(booking.professionalId),
        }),
      });

      setOccupiedAppointments(response);
    } catch (fetchError) {
      console.error(fetchError);
      setOccupiedAppointments([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [business, booking.date, booking.professionalId]);

  const refreshOccupiedDays = useCallback(
    async (baseDate?: Date) => {
      if (!business) {
        setOccupiedDays(new Set());
        return;
      }

      try {
        const referenceDate = baseDate ?? visibleMonth ?? booking.date ?? new Date();
        const monthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        const monthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);

        const response = await appointmentService.getAppointmentsByRange({
          id_negocio: String(business.id_negocio),
          desde: monthStart.toISOString(),
          hasta: monthEnd.toISOString(),
          ...(booking.professionalId && {
            id_empleado: String(booking.professionalId),
          }),
        });

        const blockedDays = new Set<string>();
        const appointmentsByDay = new Map<string, ApiTurno[]>();

        response.forEach((turno) => {
          const turnoDate = new Date(turno.fecha_hora_inicio);
          const dayKey = toLocalDateKey(turnoDate);
          const current = appointmentsByDay.get(dayKey) ?? [];
          appointmentsByDay.set(dayKey, [...current, turno]);
        });

        for (let day = new Date(monthStart); day < monthEnd; day.setDate(day.getDate() + 1)) {
          const currentDay = new Date(day);
          const dayKey = toLocalDateKey(currentDay);
          const dayAppointments = appointmentsByDay.get(dayKey) ?? [];
          const slots = generateTimeSlots(currentDay, dayAppointments, serviceDuration);
          const hasAvailable = slots.some((slot) => slot.available);

          if (!hasAvailable) {
            blockedDays.add(dayKey);
          }
        }

        setOccupiedDays(blockedDays);
      } catch (fetchError) {
        console.error(fetchError);
        setOccupiedDays(new Set());
      }
    },
    [business, booking.professionalId, booking.date, visibleMonth, serviceDuration],
  );

  useEffect(() => {
    const loadAppointments = async () => {
      await refreshOccupiedAppointments();
    };
    loadAppointments();
  }, [refreshOccupiedAppointments]);

  useEffect(() => {
    const loadOccupiedDays = async () => {
      await refreshOccupiedDays(visibleMonth);
    };
    loadOccupiedDays();
  }, [refreshOccupiedDays, visibleMonth, booking.professionalId]);

  // --- CAMBIO: Ajuste de validación de pasos ---
  const canNext = (): boolean => {
    switch (step) {
      case 1:
        // El paso 1 ahora requiere tanto servicio como profesional
        return !!booking.serviceId && !!booking.professionalId;
      case 2: // Fecha
        return !!booking.date;
      case 3: // Horario
        return timeSlots.some(
          (slot) => slot.time === effectiveSelectedTime && slot.available,
        );
      case 4: // Datos
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

  const handleConfirm = async () => {
    try {
      setSubmitError(null);

      if (!business || !booking.date || !effectiveSelectedTime || !booking.serviceId) {
        setSubmitError("Faltan datos para confirmar la reserva");
        return;
      }

      if (!booking.client.firstName.trim() || !booking.client.lastName.trim() || !booking.client.phone.trim()) {
        setSubmitError("Faltan datos del cliente");
        return;
      }

      const cliente = await clientService.upsertClient({
        telefono: booking.client.phone.trim(),
        nombre: booking.client.firstName.trim(),
        apellido: booking.client.lastName.trim(),
      });

      const payload = {
        id_negocio: Number(business.id_negocio),
        id_cliente: Number(cliente.id_cliente),
        id_servicio: Number(booking.serviceId),
        id_empleado: booking.professionalId ? Number(booking.professionalId) : null,
        fecha_hora_inicio: buildLocalDateTimeString(booking.date, effectiveSelectedTime),
      };

      await appointmentService.createAppointment(payload);
      await refreshOccupiedAppointments();
      await refreshOccupiedDays(booking.date);

      // --- CAMBIO: Completado ahora es el paso 6 ---
      setStep(6);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.status === 409) {
          setSubmitError("Ese horario ya fue reservado. Elegí otro horario disponible.");
          setBooking((current) => ({ ...current, timeSlot: "" }));
          await refreshOccupiedAppointments();
          await refreshOccupiedDays(booking.date ?? visibleMonth);
          setStep(3); // Regresa al paso de Horario
          return;
        }
        setSubmitError(error.detail || error.message);
        return;
      }

      if (error instanceof Error) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Error inesperado al crear la reserva");
    }
  };

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

  // --- CAMBIO: Completado ahora es el paso 6 ---
  if (step === 6 && selectedService && selectedProfessional && booking.date) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 py-16">
          <BookingSummary
            service={selectedService}
            professional={selectedProfessional}
            date={booking.date}
            time={effectiveSelectedTime}
            client={booking.client}
            businessName={business.nombre}
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
          <Link
            to={`/negocio/${business.slug}`}
            className="text-sm text-primary hover:underline"
          >
            ← {business.nombre}
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-foreground">Reservar turno</h1>

        <div className="mb-8">
          <BookingStepper currentStep={step} steps={STEPS} />
        </div>

        {submitError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        )}

        <div className="min-h-[300px]">
          {/* --- CAMBIO: Paso 1 ahora engloba Servicio y Profesional --- */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Elegí un servicio
                </h2>
                {services.map((service) => (
                  <ServiceCard
                    key={service.id_servicio}
                    service={service}
                    selected={
                      String(booking.serviceId) === String(service.id_servicio)
                    }
                    onSelect={() => {
                      setSubmitError(null);
                      setBooking((current) => ({
                        ...current,
                        serviceId: String(service.id_servicio),
                        timeSlot: "",
                      }));
                    }}
                    showBookButton={false}
                  />
                ))}
              </div>

              {/* El bloque de profesionales solo aparece si ya se eligió un servicio */}
              {booking.serviceId && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-lg font-semibold text-foreground">
                    Elegí un profesional
                  </h2>
                  {professionals.map((professional) => (
                    <ProfessionalCard
                      key={professional.id_empleado}
                      professional={professional}
                      selected={
                        String(booking.professionalId) ===
                        String(professional.id_empleado)
                      }
                      onSelect={(selectedProfessional) => {
                        setSubmitError(null);
                        setBooking((current) => ({
                          ...current,
                          professionalId: String(selectedProfessional.id_empleado),
                          timeSlot: "",
                        }));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- CAMBIO: Los demás pasos bajaron un número en el índice --- */}
          {step === 2 && (
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
                    month={visibleMonth}
                    onMonthChange={(month) => setVisibleMonth(month)}
                    onSelect={(date) => {
                      setSubmitError(null);
                      setBooking((current) => ({
                        ...current,
                        date: date ?? null,
                        timeSlot: "",
                      }));
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isPast = date < today;
                      const isFullyBooked = occupiedDays.has(toLocalDateKey(date));
                      return isPast || isFullyBooked;
                    }}
                    modifiers={{
                      fullyBooked: (date) => occupiedDays.has(toLocalDateKey(date)),
                    }}
                    modifiersClassNames={{
                      fullyBooked:
                        "relative !opacity-100 bg-destructive/15 text-destructive hover:bg-destructive/20 after:absolute after:inset-0 after:flex after:items-center after:justify-center after:content-['×'] after:text-destructive after:text-xl after:-mt-[2px] after:font-semibold",
                    }}
                    showOutsideDays
                    locale={es}
                  />
                </div>

                <div className="mt-7 text-center">
                  {booking.date ? (
                    <p className="text-[16px] font-medium capitalize text-violet-600">
                      {format(booking.date, "EEEE, d 'de' MMMM, yyyy", {
                        locale: es,
                      })}
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

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">
                Elegí un horario
              </h2>

              {isLoadingSlots ? (
                <p className="text-sm text-muted-foreground">
                  Cargando horarios...
                </p>
              ) : (
                <>
                  {(() => {
                    const morning = timeSlots.filter(
                      (slot) => Number(slot.time.split(":")[0]) < 12,
                    );

                    const afternoon = timeSlots.filter(
                      (slot) => Number(slot.time.split(":")[0]) >= 12,
                    );

                    const renderGroup = (label: string, slots: TimeSlot[]) => {
                      if (!slots.length) return null;

                      return (
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">
                            {label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot.id}
                                disabled={!slot.available}
                                onClick={() => {
                                  setSubmitError(null);
                                  setBooking((current) => ({
                                    ...current,
                                    timeSlot: slot.time,
                                  }));
                                }}
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                  effectiveSelectedTime === slot.time
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : slot.available
                                      ? "bg-muted hover:bg-muted/70 border-border"
                                      : "bg-muted opacity-40 cursor-not-allowed border-border",
                                )}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        {renderGroup("Mañana", morning)}
                        {renderGroup("Tarde", afternoon)}

                        {availableSlots.length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-sm text-muted-foreground">
                              No hay horarios disponibles para este día.
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Probá seleccionando otra fecha.
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <BookingForm
              data={booking.client}
              onChange={(client) =>
                setBooking((current) => ({ ...current, client }))
              }
            />
          )}

          {step === 5 &&
            selectedService &&
            selectedProfessional &&
            booking.date && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Confirmá tu turno
                </h2>
                <BookingSummary
                  service={selectedService}
                  professional={selectedProfessional}
                  date={booking.date}
                  time={effectiveSelectedTime}
                  client={booking.client}
                  businessName={business.nombre}
                />
                <div className="rounded-lg bg-muted/50 p-4 mt-4 border border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Al confirmar, recibirás los detalles de tu reserva por Email y WhatsApp.
                  </p>
                </div>
              </div>
            )}
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setStep((current) => current - 1)}
            disabled={step === 1}
          >
            Atrás
          </Button>

          {/* --- CAMBIO: Lógica de botones ajustada al nuevo índice de pasos --- */}
          {step < 5 ? (
            <Button
              onClick={() => setStep((current) => current + 1)}
              disabled={!canNext()}
            >
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