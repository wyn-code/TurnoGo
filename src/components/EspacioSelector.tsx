import CanchaCard from "@/features/business/components/CanchaCard";
import type { ApiEspacio } from "@/types/api";

interface EspacioSelectorProps {
  espacios: ApiEspacio[];
  selectedId?: string | number | null;
  onSelect: (espacio: ApiEspacio) => void;
}

/** Grilla para elegir el espacio (cancha, salón…) a reservar. */
const EspacioSelector = ({ espacios, selectedId, onSelect }: EspacioSelectorProps) => {
  if (espacios.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este negocio todavía no tiene espacios disponibles.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {espacios.map((espacio) => (
        <CanchaCard
          key={espacio.id_espacio}
          cancha={espacio}
          selected={selectedId != null && String(espacio.id_espacio) === String(selectedId)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default EspacioSelector;
