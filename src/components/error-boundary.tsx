import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Algo salió mal</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Ocurrió un error inesperado. Intentá recargar la página.
          </p>
          {this.state.error?.message && (
            <pre className="mt-4 max-w-full overflow-auto rounded-md bg-muted p-3 text-left text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
