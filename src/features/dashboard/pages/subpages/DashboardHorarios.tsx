/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
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
type DayField = keyof DaySchedule;

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

  const update = <K extends DayField>(
    day: WeekDay,
    field: K,
    value: DaySchedule[K],
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const isValidTimeRange = (start: string, end: string): boolean => {
    const [sHour, sMin] = start.split(":").map(Number);
    const [eHour, eMin] = end.split(":").map(Number);

    if (isNaN(sHour) || isNaN(sMin) || isNaN(eHour) || isNaN(eMin)) {
      return false;
    }

    if (sHour > 23 || sMin > 59 || eHour > 23 || eMin > 59) {
      return false;
    }

    return sHour * 60 + sMin < eHour * 60 + eMin;
  };

  const handleSave = async () => {
    if (!businessId) return toast.error("No hay negocio vinculado");

    const hasOpenDay = WEEK_DAYS.some((day) => schedule[day].open);
    if (!hasOpenDay) {
      return toast.error("Debe haber al menos un día abierto");
    }

    for (const day of WEEK_DAYS) {
      if (!schedule[day].open) continue;

      const { start, end } = schedule[day];
      if (!isValidTimeRange(start, end)) {
        return toast.error(
          `Horario inválido en ${day}. La apertura debe ser anterior al cierre.`,
        );
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
            Los días cerrados no se ofrecen para reservas.
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
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <Switch
                checked={schedule[day].open}
                onCheckedChange={(v) => update(day, "open", v)}
              />

              <span className="w-24 text-sm font-medium text-foreground">
                {day}
              </span>

              {schedule[day].open ? (
                <div className="flex items-center gap-2 text-sm">
                  <Input
                    type="time"
                    className="w-28"
                    value={schedule[day].start}
                    onChange={(e) => update(day, "start", e.target.value)}
                  />
                  <span className="text-muted-foreground">a</span>
                  <Input
                    type="time"
                    className="w-28"
                    value={schedule[day].end}
                    onChange={(e) => update(day, "end", e.target.value)}
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Cerrado</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHorarios;
