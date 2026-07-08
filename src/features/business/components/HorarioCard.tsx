import type { ApiHorario } from "@/types/api";
import { apiDayToWeekDayName, normalizeTimeValue } from "@/lib/schedule-utils";

interface HorarioCardProps {
  horarios: ApiHorario[];
}

export default function HorarioCard({ horarios }: HorarioCardProps) {
  const sorted = [...horarios].sort((a, b) => {
    const indexA = a.dia_semana >= 1 && a.dia_semana <= 7 ? a.dia_semana - 1 : a.dia_semana;
    const indexB = b.dia_semana >= 1 && b.dia_semana <= 7 ? b.dia_semana - 1 : b.dia_semana;
    return indexA - indexB;
  });

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Horarios de Atención</h3>

      <div className="space-y-2 text-sm">
        {sorted.map((horario) => {
          const dayName = apiDayToWeekDayName(horario.dia_semana);

          return (
            <div
              key={`${horario.dia_semana}-${horario.hora_apertura}`}
              className="flex justify-between"
            >
              <span>{dayName ?? `Día ${horario.dia_semana}`}</span>
              <span className="text-muted-foreground">
                {normalizeTimeValue(horario.hora_apertura)} -{" "}
                {normalizeTimeValue(horario.hora_cierre)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
