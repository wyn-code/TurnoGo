import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-5",

        caption: "flex justify-center relative items-center",
        caption_label: "text-base font-semibold capitalize tracking-tight",

        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-full border-border/70 bg-background p-0 opacity-80 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",

        table: "w-full border-collapse",
        head_row: "mb-1 flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-semibold text-xs text-center uppercase",

        row: "mt-1.5 flex w-full justify-between",
        cell: "h-10 w-10 text-center text-sm p-0 relative",

        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium rounded-lg transition-colors hover:bg-violet-50 hover:text-violet-700 aria-selected:!bg-violet-600 aria-selected:!text-white hover:aria-selected:!bg-violet-600 focus:aria-selected:!bg-violet-600"
        ),
        
        day_selected:
          "!bg-violet-600 !text-white hover:!bg-violet-600 hover:!text-white focus:!bg-violet-600 focus:!text-white",
        
        day_today: "bg-violet-100 text-violet-800",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",

        day_hidden: "invisible",

        ...classNames,
      }}
      formatters={{
        formatCaption: (date) =>
          date.toLocaleDateString("es-AR", {
            month: "long",
            year: "numeric",
          }),
        formatWeekdayName: (date) =>
          ["D", "L", "M", "M", "J", "V", "S"][date.getDay()],
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          const Icon =
            orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("h-4 w-4", className)} {...props} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };