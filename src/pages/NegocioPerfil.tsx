import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock, CreditCard, Instagram, Globe, Star } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ServiceCard from "@/components/business/ServiceCard";
import ProfessionalCard from "@/components/business/ProfessionalCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBusinessBySlug, getServicesByBusinessId, getProfessionalsByBusinessId } from "@/data/mockData";
import type { Service } from "@/types";

const NegocioPerfil = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const business = getBusinessBySlug(slug || "");

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Negocio no encontrado</h1>
          <Button asChild className="mt-4"><Link to="/negocios">Ver todos los negocios</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const bizServices = getServicesByBusinessId(business.id);
  const bizProfessionals = getProfessionalsByBusinessId(business.id);

  const handleBook = (service: Service) => {
    navigate(`/reservar/${business.slug}?servicio=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent sm:h-64" />

      <main className="mx-auto max-w-4xl px-4 -mt-16 pb-16 sm:px-6">
        {/* Header card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
              {business.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
                <Badge variant="secondary">{business.category}</Badge>
              </div>
              <p className="text-muted-foreground">{business.description}</p>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="fill-primary text-primary" />
                <span className="font-medium text-foreground">{business.rating}</span>
                <span className="text-muted-foreground">({business.reviewCount} reseñas)</span>
              </div>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link to={`/reservar/${business.slug}`}>Reservar turno</Link>
            </Button>
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Left: details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Información</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{business.address}, {business.city}</span>
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

              {business.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe size={16} className="shrink-0 text-primary" />
                  <span>{business.website}</span>
                </div>
              )}
            </div>

            {business.hours && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock size={16} className="text-primary" /> Horarios
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {Object.entries(business.hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between">
                      <span>{day}</span>
                      <span className="font-medium text-foreground">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {business.paymentMethods && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard size={16} className="text-primary" /> Métodos de pago
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.paymentMethods.map((m) => (
                    <Badge key={m} variant="outline">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: services */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Servicios</h2>
            <div className="space-y-3">
              {bizServices.map((s) => (
                <ServiceCard key={s.id} service={s} onBook={handleBook} />
              ))}
              {bizServices.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay servicios disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* Professionals */}
        {bizProfessionals.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Profesionales</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bizProfessionals.map((p) => (
                <ProfessionalCard key={p.id} professional={p} />
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
