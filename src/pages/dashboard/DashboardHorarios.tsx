import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { WeekSchedule } from "@/types/api";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { businessService } from "@/services/business.service";
import { Loader2 } from "lucide-react";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

type Day = (typeof DAYS)[number];
type DaySchedule = WeekSchedule[Day];
type DayField = keyof DaySchedule;

const defaultSchedule: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [d, { open: d !== "Domingo", start: "09:00", end: "18:00" }])
) as WeekSchedule;

const DashboardHorarios = () => {
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultSchedule);
  const [isLoading, setIsLoading] = useState(true);
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio;

  useEffect(() => {
    const loadSchedules = async () => {
      if (!businessId) {
        setSchedule(defaultSchedule);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const apiSchedules = await businessService.getBusinessSchedules(businessId);
        if (!apiSchedules.length) {
          setSchedule(defaultSchedule);
          return;
        }

        const mapped = { ...defaultSchedule };
        apiSchedules.forEach((item) => {
          const dayName = DAYS[item.dia_semana];
          if (!dayName) return;
          mapped[dayName] = {
            open: true,
            start: item.hora_apertura.slice(0, 5),
            end: item.hora_cierre.slice(0, 5),
          };
        });
        setSchedule(mapped);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los horarios del negocio");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSchedules();
  }, [businessId]);

  const update = <K extends DayField>(day: Day, field: K, value: DaySchedule[K]) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No encontramos un negocio vinculado a tu usuario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Horarios de atención</h2>
        <Button size="sm" onClick={() => toast.success("Horarios guardados (mock)")}>
          Guardar cambios
        </Button>
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch
                checked={schedule[day].open}
                onCheckedChange={(v) => update(day, "open", v)}
              />

              <span className="w-24 text-sm font-medium text-foreground">{day}</span>

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