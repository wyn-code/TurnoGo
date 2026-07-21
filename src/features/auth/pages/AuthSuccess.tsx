import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loginWithToken(token).then((result) => {
      if (result.success && result.user) {
        const role = result.user.role?.toLowerCase();
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else if (role === "duenio" || role === "dueño") {
          if (!result.user.hasBusiness) {
            navigate("/registrar-negocio", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate, searchParams, loginWithToken]);

  return (
    <div className="p-8 text-center">
      Iniciando sesión...
    </div>
  );
}