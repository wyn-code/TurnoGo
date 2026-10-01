import EspacioSelector from "@/components/EspacioSelector";
import ProfessionalCard from "@/features/business/components/ProfessionalCard";
import type { ApiEmpleado, ApiEspacio } from "@/types/api";

interface BookingResourceStepProps {
  /** Negocio multi-espacio: se reserva un espacio; si no, un profesional. */
  multiEspacio: boolean;
  espacios: ApiEspacio[];
  professionals: ApiEmpleado[];
  selectedEspacioId?: string | number | null;
  selectedProfessionalId?: string | number | null;
  onSelectEspacio: (espacio: ApiEspacio) => void;
  onSelectProfessional: (professional: ApiEmpleado) => void;
}

/** Paso "recurso" de la reserva: espacios o empleados según el tipo de negocio. */
const BookingResourceStep = ({
  multiEspacio,
  espacios,
  professionals,
  selectedEspacioId,
  selectedProfessionalId,
  onSelectEspacio,
  onSelectProfessional,
}: BookingResourceStepProps) =>
  multiEspacio ? (
    <EspacioSelector
      espacios={espacios}
      selectedId={selectedEspacioId}
      onSelect={onSelectEspacio}
    />
  ) : (
    <div className="grid gap-3 sm:grid-cols-2">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id_empleado}
          professional={professional}
          selected={
            selectedProfessionalId != null &&
            String(professional.id_empleado) === String(selectedProfessionalId)
          }
          onSelect={onSelectProfessional}
        />
      ))}
    </div>
  );

export default BookingResourceStep;
