import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "@/lib/api-client";

export default function VerifyEmailPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await apiClient.get(
          `/auth/verify-email/${token}`,
        );

        setSuccess(true);
        setMessage(
          "Tu email fue verificado correctamente.",
        );
      } catch (error: any) {
        setSuccess(false);

        setMessage(
          error?.response?.data?.detail ||
          "No se pudo verificar el email.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

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

      <Link
        to="/login"
        className="text-primary underline"
      >
        Ir a iniciar sesión
      </Link>
    </div>
  );
}