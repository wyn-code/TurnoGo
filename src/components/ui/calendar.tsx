"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      locale={es}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 relative",
        month_caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-[15px] font-medium capitalize",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          "absolute left-1 top-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-gray-200 flex items-center justify-center transition-colors"
        ),
        button_next: cn(
          "absolute right-1 top-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-gray-200 flex items-center justify-center transition-colors"
        ),
        month_grid: "w-full border-collapse mx-auto",
        weekdays: "flex justify-center gap-1 mb-2",
        weekday: "text-gray-500 w-10 font-normal text-[0.85rem] flex items-center justify-center",
        week: "flex justify-center w-full mt-1 gap-1",

        // 1. EL CONTENEDOR CUADRADO: Totalmente limpio y sin color
        day: "p-0 relative flex items-center justify-center", 
        
        // 2. EL BOTÓN REDONDO (Días normales): Transparente y con hover clarito
        day_button: cn(
          "h-10 w-10 p-0 font-normal rounded-xl bg-transparent hover:bg-violet-100 transition-all flex items-center justify-center text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1"
        ),
        
        // 3. LA MAGIA ACÁ: Si el contenedor está seleccionado, fuerza los estilos SOLAMENTE al botón de adentro.
        // El `hover:!bg-violet-600` mata al hover clarito del botón.
        selected: "[&_button]:!bg-violet-600 [&_button]:!text-white [&_button]:!font-medium [&_button]:hover:!bg-violet-600",
        
        // Lo mismo para el día de hoy, pintamos el botón y no el contenedor
        today: "[&_button]:bg-violet-100 [&_button]:text-violet-900 [&_button]:font-bold",
        
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-300 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };