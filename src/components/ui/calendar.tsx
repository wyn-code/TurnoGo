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
          "absolute left-1 top-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-border flex items-center justify-center transition-colors"
        ),
        button_next: cn(
          "absolute right-1 top-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-border flex items-center justify-center transition-colors"
        ),
        month_grid: "w-full border-collapse mx-auto",
        weekdays: "flex justify-center gap-1 mb-2",
        weekday: "text-muted-foreground w-10 font-normal text-[0.85rem] flex items-center justify-center",
        week: "flex justify-center w-full mt-1 gap-1",

        day: "p-0 relative flex items-center justify-center", 
        
        day_button: cn(
          "h-10 w-10 p-0 font-normal rounded-xl bg-transparent hover:bg-accent transition-all flex items-center justify-center text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        ),
        
        selected: "[&_button]:!bg-primary [&_button]:!text-primary-foreground [&_button]:!font-medium [&_button]:hover:!bg-primary",
        
        today: "[&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:font-bold",
        
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground/50 opacity-50",
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