import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
            }
          ) => void;
        };
      };
    };
  }
}

const MAX_RETRIES = 20; // ~4 segundos (20 * 200ms)
const RETRY_DELAY_MS = 200;

export function SocialAuthButtons({
  onNeedsVerification,
}: {
  onNeedsVerification?: () => void;
}) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = (location.state as { from?: string } | null)?.from;
  const [googleError, setGoogleError] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const handleGoogleCredential = async (credential: string) => {
    setGoogleError("");

    const result = await loginWithGoogle(credential);

    if (!result.success) {
      if ("needsVerification" in result && result.needsVerification) {
        if (onNeedsVerification) {
          onNeedsVerification();
        } else {
          setGoogleError("Cuenta creada. Revisá tu email para verificarla.");
        }
        return;
      }

      if ("error" in result) {
        setGoogleError(result.error);
      } else {
        setGoogleError("Error al iniciar sesión con Google");
      }
      return;
    }

    // Login exitoso: volvemos a donde el usuario quería ir,
    // o a "/dashboard" por defecto (ProtectedRoute decide el
    // destino final según el rol: admin, dueño sin negocio, etc.)
    navigate(redirectPath || "/dashboard", { replace: true });
  };

  useEffect(() => {
    if (initialized.current) return;

    let cancelled = false;
    let attempts = 0;

    const trySetup = () => {
      if (cancelled) return;

      if (window.google?.accounts?.id && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              handleGoogleCredential(response.credential);
            } else {
              setGoogleError("No se pudo obtener la credencial de Google.");
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 300,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });

        initialized.current = true;
        return;
      }

      attempts += 1;
      if (attempts >= MAX_RETRIES) {
        setGoogleError("Servicio de Google no disponible. Recargá la página.");
        return;
      }

      setTimeout(trySetup, RETRY_DELAY_MS);
    };

    setTimeout(trySetup, 0);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">O continuar con</span>
        </div>
      </div>

      {googleError && (
        <p className="text-center text-sm text-destructive">{googleError}</p>
      )}

      <div className="flex justify-center">
        <div ref={buttonRef} />
      </div>
    </div>
  );
}