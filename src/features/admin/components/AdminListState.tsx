import { AlertCircle, Loader2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminListLoadingProps {
  label: string;
}

export function AdminListLoading({ label }: AdminListLoadingProps) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{label}</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      </div>
    </div>
  );
}

interface AdminListErrorProps {
  message?: string;
  onRetry: () => void;
}

export function AdminListError({ message, onRetry }: AdminListErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No se pudieron cargar los datos</AlertTitle>
      <AlertDescription>
        <p>{message || "Ocurrió un error inesperado."}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  );
}
