import type { ApiHorario } from "@/types/api";

interface HorarioCardProps {
  horarios: ApiHorario[];
}

const dias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function HorarioCard({
  horarios,
}: HorarioCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">
        Horarios de Atención
      </h3>

      <div className="space-y-2 text-sm">
        {horarios.map((horario) => (
          <div
            key={horario.dia_semana}
            className="flex justify-between"
          >
            <span>{dias[horario.dia_semana]}</span>

            <span className="text-muted-foreground">
              {horario.hora_apertura.slice(0, 5)} -{" "}
              {horario.hora_cierre.slice(0, 5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}