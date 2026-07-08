import { Check } from "lucide-react";

interface BookingStepperProps {
  currentStep: number;
  steps: string[];
}

const BookingStepper = ({ currentStep, steps }: BookingStepperProps) => (
  <div className="flex items-center justify-between gap-2">
    {steps.map((label, i) => {
      const step = i + 1;
      const isDone = step < currentStep;
      const isCurrent = step === currentStep;

      return (
        <div key={step} className="flex flex-1 items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                isDone
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-2 border-primary text-primary"
                    : "border-2 border-border text-muted-foreground"
              }`}
            >
              {isDone ? <Check size={16} /> : step}
            </div>
            <span className={`text-xs text-center hidden sm:block ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px flex-1 ${isDone ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      );
    })}
  </div>
);

export default BookingStepper;