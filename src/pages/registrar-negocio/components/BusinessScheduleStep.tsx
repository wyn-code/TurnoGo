import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];

export default function BusinessScheduleStep({ form }: Props) {
  const { register, watch } = form;

  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const open = watch(`horarios.${day}.open`);

        return (
          <div key={day} className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register(`horarios.${day}.open`)}
            />

            <span>{day}</span>

            {open && (
              <>
                <Input
                  type="time"
                  {...register(`horarios.${day}.start`)}
                />

                <Input
                  type="time"
                  {...register(`horarios.${day}.end`)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}