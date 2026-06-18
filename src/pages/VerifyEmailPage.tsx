import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { loginWithToken } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [success, setSuccess] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response =
          await apiClient.get<{
            message: string;
            access_token: string;
            token_type: string;
            usuario_id: number;
          }>(
            `/auth/verify-email/${token}`,
          );

        const session =
          await loginWithToken(
            response.access_token,
          );

        if (!session.success) {
          throw new Error(
            session.error,
          );
        }

        setSuccess(true);

        setMessage(
          "Tu email fue verificado correctamente. Serás redirigido para registrar tu negocio."
        );

        setTimeout(() => {
          navigate(
            "/registrar-negocio",
          );
        }, 2000);

      } catch (error: any) {
        setSuccess(false);

        setMessage(
          error?.message ||
          "No se pudo verificar el email."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [
    token,
    navigate,
    loginWithToken,
  ]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Verificando email...
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">
        {success
          ? "✅ Email verificado"
          : "❌ Error"}
      </h1>

      <p className="mb-6">
        {message}
      </p>
    </div>
  );
}