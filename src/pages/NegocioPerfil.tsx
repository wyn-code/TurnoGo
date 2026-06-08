import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Phone, Instagram } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ServiceCard from "@/components/business/ServiceCard";
import ProfessionalCard from "@/components/business/ProfessionalCard";
import { Button } from "@/components/ui/button";

import { businessService } from "@/services/business.service";
import { servicioService } from "@/services/servicio.service";
import { empleadoService } from "@/services/empleado.service";
import type { ApiNegocio, ApiEmpleado, ApiServicio } from "@/types/api";

import Map from "@/components/business/Map";
import HorarioCard from "@/components/business/HorarioCard";

const NegocioPerfil = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<ApiNegocio | null>(null);
  const [services, setServices] = useState<ApiServicio[]>([]);
  const [professionals, setProfessionals] = useState<ApiEmpleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        if (!slug) {
          throw new Error("Slug no recibido");
        }

        setIsLoading(true);
        setError(null);

        const businessData = await businessService.getBusinessBySlug(slug);

        console.log("NEGOCIO:", businessData);

        setBusiness(businessData);

        const [servicesData, professionalsData] = await Promise.all([
          servicioService.getByBusiness(businessData.id_negocio),
          empleadoService.getByBusiness(businessData.id_negocio),
        ]);

        setServices(servicesData);
        setProfessionals(professionalsData);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el negocio");
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessData();
  }, [slug]);

  const handleBook = (service: ApiServicio) => {
    if (!business?.slug) return;

    navigate(`/reservar/${business.slug}?servicio=${service.id_servicio}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p>Cargando negocio...</p>
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
          <h1 className="text-2xl font-bold text-foreground">
            Negocio no encontrado
          </h1>

          <Button asChild className="mt-4">
            <Link to="/negocios">Ver todos los negocios</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent sm:h-64" />

      <main className="mx-auto max-w-5xl px-4 -mt-16 pb-16 sm:px-6">
        {/* HEADER */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary overflow-hidden">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                business.nombre.charAt(0)
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {business.nombre}
              </h1>

              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{business.ciudad}</span>
                </div>

                {business.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{business.telefono}</span>
                  </div>
                )}
              </div>
            </div>

            <Button asChild size="lg" className="shrink-0 min-w-[180px]">
              <Link to={`/reservar/${business.slug}`}>Reservar turno</Link>
            </Button>
          </div>
        </div>

        {/* INFO + SERVICIOS */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Información</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {business.direccion}, {business.ciudad}
                </span>
              </div>

              {business.telefono && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={16} className="shrink-0 text-primary" />
                  <span>{business.telefono}</span>
                </div>
              )}

              {business.ig_url && (
                <a
                  href={business.ig_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Instagram size={16} className="shrink-0 text-primary" />
                  <span>{business.ig_url}</span>
                </a>
              )}
            </div>
          </div>
          {business.horarios && business.horarios.length > 0 && (
            <HorarioCard horarios={business.horarios} />
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Servicios ({services.length})
            </h2>

            <div className="space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <ServiceCard
                    key={service.id_servicio}
                    service={service}
                    onBook={handleBook}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay servicios disponibles.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MAPA */}
        {business.latitud && business.longitud && (
          <div className="mt-10 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Ubicación</h2>

              <p className="text-sm text-muted-foreground">
                {business.direccion}, {business.ciudad}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <Map
                latitud={business.latitud}
                longitud={business.longitud}
                nombre={business.nombre}
              />
            </div>

            <div className="mt-4">
              <Button asChild variant="outline">
                <a
                  href={`https://www.google.com/maps?q=${business.latitud},${business.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Cómo llegar
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* PROFESIONALES */}
        {professionals.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="text-lg font-semibold">
              Profesionales ({professionals.length})
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id_empleado}
                  professional={professional}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NegocioPerfil;
