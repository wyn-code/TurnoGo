import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { WeekSchedule } from "@/types/api";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { Loader2 } from "lucide-react";
import { useHorarios } from "@/hooks/queries/useHorariosQuery";
import { useUpdateHorarios } from "@/hooks/mutations/useUpdateHorarios";
import {
  WEEK_DAYS,
  mapHorariosToWeekSchedule,
  mapWeekScheduleToPayload,
  type WeekDay,
} from "@/lib/schedule-utils";

type DaySchedule = WeekSchedule[WeekDay];

const DashboardHorarios = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ? String(business.id_negocio) : null;

  const { data: apiHorarios = [], isLoading, error } = useHorarios(businessId);
  const updateMutation = useUpdateHorarios();

  const [schedule, setSchedule] = useState<WeekSchedule>(() =>
    mapHorariosToWeekSchedule([]),
  );

  useEffect(() => {
    if (!isLoading) {
      setSchedule(mapHorariosToWeekSchedule(apiHorarios));
    }
  }, [apiHorarios, isLoading]);

  const update = (
    day: WeekDay,
    field: "start" | "end" | "start2" | "end2",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const isValidTime = (val: string) => {
    const [h, m] = val.split(":").map(Number);
    return !isNaN(h) && !isNaN(m) && h <= 23 && m <= 59;
  };

  const isValidTimeRange = (start: string, end: string): boolean => {
    const [sHour, sMin] = start.split(":").map(Number);
    const [eHour, eMin] = end.split(":").map(Number);
    if (isNaN(sHour) || isNaN(sMin) || isNaN(eHour) || isNaN(eMin)) return false;
    return sHour * 60 + sMin !== eHour * 60 + eMin;
  };

  const slotsOverlap = (
    s1: string, e1: string,
    s2: string, e2: string,
  ): boolean => {
    const t = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    return t(s1) < t(e2) && t(s2) < t(e1);
  };

  const handleSave = async () => {
    if (!businessId) return toast.error("No hay negocio vinculado");

    const hasOpenDay = WEEK_DAYS.some((day) => schedule[day].open);
    if (!hasOpenDay) {
      return toast.error("Debe haber al menos un día abierto");
    }

    for (const day of WEEK_DAYS) {
      if (!schedule[day].open) continue;

      const { start, end, start2, end2 } = schedule[day];
      if (!isValidTimeRange(start, end)) {
        return toast.error(`Horario inválido en ${day}. La apertura y cierre no pueden ser iguales.`);
      }

      if (start2 && end2) {
        if (!isValidTimeRange(start2, end2)) {
          return toast.error(`Horario inválido en ${day} (2da franja). La apertura y cierre no pueden ser iguales.`);
        }
        if (slotsOverlap(start, end, start2, end2)) {
          return toast.error(`Las franjas horarias se superponen en ${day}.`);
        }
      }
    }

    try {
      const payload = mapWeekScheduleToPayload(schedule);

      await updateMutation.mutateAsync({
        businessId: Number(businessId),
        horarios: payload,
        hasExisting: apiHorarios.length > 0,
      });

      toast.success("Horarios guardados correctamente");
    } catch {
      // El hook ya muestra el error del API
    }
  };

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-8 text-center">
        <p className="text-destructive">
          Error cargando horarios: {error.message}
        </p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Horarios de atención
          </h2>
          <p className="text-sm text-muted-foreground">
            Los días cerrados no se ofrecen para reservas. Máximo 2 franjas por día.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          {WEEK_DAYS.map((day) => {
            const d = schedule[day];
            const hasSecondSlot = !!(d.start2 && d.end2);

            return (
              <div
                key={day}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={d.open}
                    onCheckedChange={(v) => {
                      setSchedule((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], open: v },
                      }));
                    }}
                  />

                  <span className="w-24 text-sm font-medium text-foreground">
                    {day}
                  </span>

                  {d.open ? (
                    <div className="flex flex-col gap-2 flex-1">
                      {/* Franja 1 */}
                      <div className="flex items-center gap-2 text-sm">
                        <Input
                          type="time"
                          className="w-28"
                          value={d.start}
                          onChange={(e) => update(day, "start", e.target.value)}
                        />
                        <span className="text-muted-foreground">a</span>
                        <Input
                          type="time"
                          className="w-28"
                          value={d.end}
                          onChange={(e) => update(day, "end", e.target.value)}
                        />
                        {hasSecondSlot ? (
                          <span className="text-xs text-muted-foreground ml-2">Franja 1</span>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 ml-2"
                            onClick={() => {
                              setSchedule((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], start2: "14:00", end2: "18:00" },
                              }));
                            }}
                          >
                            <Plus size={14} /> Agregar franja
                          </Button>
                        )}
                      </div>

                      {/* Franja 2 */}
                      {hasSecondSlot && (
                        <div className="flex items-center gap-2 text-sm pl-2 border-l-2 border-primary/30 ml-1">
                          <Input
                            type="time"
                            className="w-28"
                            value={d.start2!}
                            onChange={(e) => update(day, "start2", e.target.value)}
                          />
                          <span className="text-muted-foreground">a</span>
                          <Input
                            type="time"
                            className="w-28"
                            value={d.end2!}
                            onChange={(e) => update(day, "end2", e.target.value)}
                          />
                          <span className="text-xs text-muted-foreground">Franja 2</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive gap-1"
                            onClick={() => {
                              setSchedule((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], start2: undefined, end2: undefined },
                              }));
                            }}
                          >
                            <X size={14} /> Quitar
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Cerrado</span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHorarios;
