import type { ApiHorario, WeekSchedule } from "@/types/api";

export const WEEK_DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export const defaultWeekSchedule: WeekSchedule = Object.fromEntries(
  WEEK_DAYS.map((d) => [d, { open: d !== "Domingo", start: "09:00", end: "18:00" }]),
) as WeekSchedule;

const closedWeekSchedule: WeekSchedule = Object.fromEntries(
  WEEK_DAYS.map((d) => [d, { open: false, start: "09:00", end: "18:00" }]),
) as WeekSchedule;

/** Backend: 0 = Lunes … 6 = Domingo (misma convención que registro y reservas) */
export function weekDayIndexToApi(dayIndex: number): number {
  return dayIndex;
}

/** Convierte dia_semana del API al índice 0–6 (Lunes–Domingo). */
export function apiDayToWeekDayIndex(diaSemana: number): number | null {
  if (diaSemana >= 1 && diaSemana <= 7) {
    return diaSemana - 1;
  }
  if (diaSemana >= 0 && diaSemana <= 6) {
    return diaSemana;
  }
  return null;
}

export function apiDayToWeekDayName(diaSemana: number): WeekDay | null {
  const index = apiDayToWeekDayIndex(diaSemana);
  if (index == null) return null;
  return WEEK_DAYS[index];
}

export function normalizeTimeValue(value: string): string {
  return value.slice(0, 5);
}

export function formatTimeForApi(value: string): string {
  if (!value) return "09:00:00";
  return value.length === 5 ? `${value}:00` : value;
}

export function mapHorariosToWeekSchedule(
  apiHorarios: ApiHorario[],
): WeekSchedule {
  if (!apiHorarios.length) {
    return { ...closedWeekSchedule };
  }

  const mapped: WeekSchedule = { ...closedWeekSchedule };

  apiHorarios.forEach((item) => {
    const dayName = apiDayToWeekDayName(item.dia_semana);
    if (!dayName) return;

    mapped[dayName] = {
      open: true,
      start: normalizeTimeValue(item.hora_apertura),
      end: normalizeTimeValue(item.hora_cierre),
    };
  });

  return mapped;
}

export function mapWeekScheduleToPayload(
  schedule: WeekSchedule,
): Array<{ dia_semana: number; hora_apertura: string; hora_cierre: string }> {
  return WEEK_DAYS.flatMap((dayName, index) => {
    const day = schedule[dayName];
    if (!day.open) return [];

    return [
      {
        dia_semana: weekDayIndexToApi(index),
        hora_apertura: formatTimeForApi(day.start),
        hora_cierre: formatTimeForApi(day.end),
      },
    ];
  });
}

export function countOpenDays(apiHorarios: ApiHorario[]): number {
  const openDays = new Set<number>();
  apiHorarios.forEach((h) => {
    if (apiDayToWeekDayIndex(h.dia_semana) != null) {
      openDays.add(h.dia_semana);
    }
  });
  return openDays.size;
}
