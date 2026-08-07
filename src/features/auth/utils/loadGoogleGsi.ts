const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

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
              text?:
                | "signin_with"
                | "signup_with"
                | "continue_with"
                | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
            }
          ) => void;
        };
      };
    };
  }
}

let pendingPromise: Promise<void> | null = null;

export function loadGoogleGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SCRIPT_SRC}"]`
    );

    if (existing && existing.dataset.loaded === "true") {
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        reject(new Error("El script de Google ya se cargó pero window.google no está disponible."));
      }
      return;
    }

    const script = existing || document.createElement("script");

    if (!existing) {
      script.src = GSI_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
    }

    const handleLoad = () => {
      script.dataset.loaded = "true";
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        reject(
          new Error(
            "El script de Google Identity Services se descargó pero window.google.accounts.id no se inicializó."
          )
        );
      }
    };

    const handleError = () => {
      console.error(
        "[Google GIS] Error al cargar el script de Google Identity Services:",
        {
          src: GSI_SCRIPT_SRC,
          message: "El navegador no pudo descargar/ejecutar el script. " +
            "Posibles causas: red caída, bloqueo por adblocker/extensiones, " +
            "CSP del sitio, o el script tardó demasiado.",
          readyState: document.readyState,
        }
      );
      reject(
        new Error(
          `No se pudo cargar el script de Google Identity Services (${GSI_SCRIPT_SRC}).`
        )
      );
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      document.head.appendChild(script);
    }
  });

  pendingPromise.finally(() => {
    pendingPromise = null;
  });

  return pendingPromise;
}
