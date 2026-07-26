import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useState } from "react";


export function SocialAuthButtons({
  onNeedsVerification,
}: {
  onNeedsVerification?: () => void;
}) {
  const { loginWithGoogle } = useAuth();
  const [googleError, setGoogleError] = useState("");

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setGoogleError("");

    if (!credentialResponse.credential) {
      console.error("No se recibió credential");
      return;
    }

    const result = await loginWithGoogle(
  credentialResponse.credential
);

if (!result.success) {
  if ("needsVerification" in result && result.needsVerification) {
    if (onNeedsVerification) {
      onNeedsVerification();
    } else {
      setGoogleError(
        "Cuenta creada. Revisá tu email para verificarla."
      );
    }
    return;
  }

  if ("error" in result) {
    setGoogleError(result.error);
  } else {
    setGoogleError("Error al iniciar sesión con Google");
  }
}
  }

  const handleGoogleError = () => {
    console.error("Google login error");
    setGoogleError("Error al iniciar sesión con Google");
  };

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

      <div className="grid grid-cols-2 gap-3">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
}

