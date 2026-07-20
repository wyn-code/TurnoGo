import type { LucideIcon } from "lucide-react";

interface StatsEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StatsEmptyState({ icon: Icon, title, description }: StatsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
