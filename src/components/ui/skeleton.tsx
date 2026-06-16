import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted/80 via-muted/50 to-muted/80", 
        className
      )} 
      {...props} 
    />
  );
}

export { Skeleton };