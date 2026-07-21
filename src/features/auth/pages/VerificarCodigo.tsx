import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";

const PENDING_KEY = "turnexo_pending_2fa";

interface Pending {
  email: string;
  password: string;
  code: string;
  from: string;
  expiresAt: number;
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function readPending(): Pending | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const parsed: Pending = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const VerificarCodigo = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Pending | null>(() => readPending());
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!pending) {
      navigate("/login", { replace: true });
      return;
    }
    toast.info(`Código de verificación enviado (demo): ${pending.code}`, { duration: 8000 });
  }, [pending, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    setError("");
    if (code.length !== 6) {
      setError("Ingresá los 6 dígitos del código.");
      return;
    }
    if (code !== pending.code) {
      setError("El código es incorrecto. Verificá e intentá de nuevo.");
      return;
    }
    setSubmitting(true);
    const result = await login(pending.email, pending.password);
    setSubmitting(false);
    if (result.success) {
      sessionStorage.removeItem(PENDING_KEY);
      toast.success("Verificación exitosa. ¡Bienvenido/a!");
      navigate(pending.from || "/dashboard", { replace: true });
    } else {
      setError(result.error || "No se pudo iniciar sesión.");
    }
  };

  const handleResend = () => {
    if (!pending) return;
    const newCode = generateCode();
    const updated: Pending = { ...pending, code: newCode, expiresAt: Date.now() + 5 * 60 * 1000 };
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(updated));
    setPending(updated);
    setResendCooldown(30);
    toast.info(`Nuevo código enviado (demo): ${newCode}`, { duration: 8000 });
  };

  const maskedEmail = pending?.email
    ? pending.email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + "*".repeat(Math.max(b.length, 1)) + c)
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <Card className="w-full">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verificación en dos pasos</h1>
            <p className="text-sm text-muted-foreground">
              Ingresá el código de 6 dígitos que enviamos a
            </p>
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <Mail size={14} className="text-primary" />
              {maskedEmail}
            </p>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={submitting || code.length !== 6}>
                {submitting ? "Verificando..." : "Verificar e iniciar sesión"}
              </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
              ¿No recibiste el código?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar código"}
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/login" className="hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VerificarCodigo;
