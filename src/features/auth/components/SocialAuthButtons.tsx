import { loadGoogleGsiScript } from "@/features/auth/utils/loadGoogleGsi";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GSI_TIMEOUT_MS = 10_000;

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

    const setup = async () => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          console.error(
            "[Google GIS] VITE_GOOGLE_CLIENT_ID no está definido. " +
              "Configurá la variable de entorno en tu entorno de build (Vercel) o en el archivo .env."
          );
          setGoogleError(
            "Servicio de Google no configurado. Revisá la configuración del sitio."
          );
          return;
        }

        await loadGoogleGsiScript();

        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
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
        if (timeoutId) clearTimeout(timeoutId);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "[Google GIS] Falló la inicialización del botón de Google:",
          {
            error,
            message: error instanceof Error ? error.message : String(error),
            clientIdSet: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
            gsiLoaded: !!window.google?.accounts?.id,
          }
        );

        setGoogleError("Servicio de Google no disponible. Recargá la página.");
      }
    };

    const timeoutId = setTimeout(() => {
      if (cancelled || initialized.current) return;

      console.error(
        "[Google GIS] Timeout de espera: el script de Google no quedó disponible " +
          `después de ${GSI_TIMEOUT_MS}ms.`,
        {
          gsiLoaded: !!window.google?.accounts?.id,
          readyState: document.readyState,
        }
      );

      setGoogleError("Servicio de Google no disponible. Recargá la página.");
    }, GSI_TIMEOUT_MS);

    setup();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
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