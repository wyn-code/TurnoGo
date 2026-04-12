import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Phone, Instagram, Facebook } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ServiceCard from "@/components/business/ServiceCard";
import ProfessionalCard from "@/components/business/ProfessionalCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { businessService } from "@/services/business.service";
import type { Business, Service, Professional } from "@/types";

const NegocioPerfil = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
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
        setBusiness(businessData);

        const [servicesData, professionalsData] = await Promise.all([
          businessService.getBusinessServices(businessData.id),
          businessService.getBusinessProfessionals(businessData.id),
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

  const handleBook = (service: Service) => {
    if (!business?.slug) return;
    navigate(`/reservar/${business.slug}?servicio=${service.id}`);
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
          <h1 className="text-2xl font-bold text-foreground">Negocio no encontrado</h1>
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

      <main className="mx-auto max-w-4xl px-4 -mt-16 pb-16 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
              {business.image ? (
                <img
                  src={business.image}
                  alt={business.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                business.name.charAt(0)
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
                <Badge variant="secondary">{business.category}</Badge>
              </div>
            </div>

            <Button asChild size="lg" className="shrink-0">
              <Link to={`/reservar/${business.slug}`}>Reservar turno</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Información</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {business.address}, {business.city}
                </span>
              </div>

              {business.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={16} className="shrink-0 text-primary" />
                  <span>{business.phone}</span>
                </div>
              )}

              {business.instagram && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Instagram size={16} className="shrink-0 text-primary" />
                  <span>{business.instagram}</span>
                </div>
              )}

              {business.facebook && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Facebook size={16} className="shrink-0 text-primary" />
                  <span>{business.facebook}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Servicios</h2>
            <div className="space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={handleBook} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay servicios disponibles.
                </p>
              )}
            </div>
          </div>
        </div>

        {professionals.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Profesionales</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
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