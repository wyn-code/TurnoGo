import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

const DAYS = [
  "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"
];

export default function BusinessScheduleStep({ form }: Props) {
  const { register, watch } = form;

  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const open = watch(`schedule.${day}.open`);

        return (
          <div key={day} className="flex items-center gap-3">
            <input type="checkbox" {...register(`schedule.${day}.open`)} />

            <span>{day}</span>

            {open && (
              <>
                <Input type="time" {...register(`schedule.${day}.start`)} />
                <Input type="time" {...register(`schedule.${day}.end`)} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}