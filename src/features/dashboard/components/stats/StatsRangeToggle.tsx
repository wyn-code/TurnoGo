import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { StatisticsRange } from "@/types/statistics";

const RANGE_OPTIONS: { value: StatisticsRange; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
  { value: "anio", label: "Año" },
];

interface StatsRangeToggleProps {
  value: StatisticsRange;
  onChange: (value: StatisticsRange) => void;
}

export function StatsRangeToggle({ value, onChange }: StatsRangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as StatisticsRange);
      }}
      variant="outline"
      size="sm"
      className="flex-wrap"
      aria-label="Seleccionar período"
    >
      {RANGE_OPTIONS.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
          aria-label={opt.label}
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
