import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

interface BookingFormProps {
  data: ClientData;
  onChange: (data: ClientData) => void;
}

const BookingForm = ({ data, onChange }: BookingFormProps) => {
  const update = (field: keyof ClientData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Tus datos</h3>
      <p className="text-sm text-muted-foreground">No necesitás tener cuenta para reservar.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input id="firstName" placeholder="Tu nombre" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input id="lastName" placeholder="Tu apellido" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            // NUEVO: Agregamos placeholder para guiar el formato
            placeholder="Ej: +54 9 11 1234 5678" 
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            required
          />
          {/* NUEVO: Texto de ayuda */}
          <p className="text-[13px] text-muted-foreground">
            A este número te enviaremos el recordatorio por WhatsApp.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="tu@email.com" value={data.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observaciones</Label>
        <Textarea id="notes" placeholder="Algún detalle que quieras comentar..." value={data.notes} onChange={(e) => update("notes", e.target.value)} />
      </div>
    </div>
  );
};

export default BookingForm;