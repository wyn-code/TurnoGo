import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem(
      "access_token",
      token,
    );

    navigate("/registrar-negocio");
  }, [navigate, searchParams]);

  return (
    <div className="p-8 text-center">
      Iniciando sesión...
    </div>
  );
}