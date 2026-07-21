// pages/Login.tsx

import { useState } from "react";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useAuth } from "../contexts/AuthContext";

import Navbar from "@/features/landing/components/Navbar";

import Footer from "@/features/landing/components/Footer";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, AlertCircle, Eye, EyeOff, ShieldCheck, Mail } from "lucide-react";


const PENDING_KEY = "turnexo_pending_2fa";
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const schema = z.object({
  email: z
    .string()
    .min(
      1,
      "Ingresá tu email o usuario",
    ),

  password: z
    .string()
    .min(
      6,
      "Mínimo 6 caracteres",
    ),
});

type FormData = z.infer<
  typeof schema
>;

const Login = () => {
  const { verifyCredentials } = useAuth();

  const navigate = useNavigate();

  const location =
    useLocation();

  const redirectPath =
    location.state?.from;

  const [serverError, setServerError] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);
    const [twoFAOpen, setTwoFAOpen] = useState(false);
  const [pendingCreds, setPendingCreds] = useState<{ email: string; password: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver:
      zodResolver(schema),
  });

  const onSubmit = async (
    data: FormData,
  ) => {
    setServerError("");
        const result = await verifyCredentials(data.email, data.password);
    if (!result.success) {
      setServerError(result.error || "Error al iniciar sesión.");
      return;
    }
    setPendingCreds({ email: data.email, password: data.password });
    setTwoFAOpen(true);
  };
  const handleSendCode = () => {
    if (!pendingCreds) return;
    const code = generateCode();
    sessionStorage.setItem(
      PENDING_KEY,
      JSON.stringify({
        email: pendingCreds.email,
        password: pendingCreds.password,
        code,
        from: redirectPath || "",
        expiresAt: Date.now() + 5 * 60 * 1000,
      })
    );
    setTwoFAOpen(false);
    navigate("/verificar-codigo");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main
        className="
          mx-auto
          flex
          max-w-md
          flex-col
          items-center
          px-4
          py-16
        "
      >
        <Card className="w-full">
          <CardHeader
            className="
              space-y-2
              pb-2
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-accent
              "
            >
              <LogIn
                className="
                  h-6
                  w-6
                  text-primary
                "
              />
            </div>

            <h1
              className="
                text-2xl
                font-bold
                text-foreground
              "
            >
              Iniciá sesión
            </h1>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Accedé para administrar
              tu negocio.
            </p>
          </CardHeader>

          <CardContent
            className="
              space-y-4
              pt-4
            "
          >
            {/* SERVER ERROR */}

            {serverError && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-destructive/30
                  bg-destructive/10
                  p-3
                  text-sm
                  text-destructive
                "
              >
                <AlertCircle
                  size={16}
                />

                {serverError}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit(
                onSubmit,
              )}
              className="space-y-4"
            >
              {/* EMAIL */}

              <div className="space-y-2">
                <Label>
                  Email o Usuario
                </Label>

                <Input
                  {...register(
                    "email",
                  )}
                  type="text"
                  placeholder="tu@email.com o usuario"
                />

                {errors.email && (
                  <p
                    className="
                      text-sm
                      text-destructive
                    "
                  >
                    {
                      errors.email
                        .message
                    }
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div className="space-y-2">
                <Label>
                  Contraseña
                </Label>

                <div className="relative">
                  <Input
                    {...register(
                      "password",
                    )}
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword,
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      transition-colors
                      hover:text-foreground
                    "
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p
                    className="
                      text-sm
                      text-destructive
                    "
                  >
                    {
                      errors.password
                        .message
                    }
                  </p>
                )}
                <div className="text-right">
                  <Link to="/olvide-contrasena" className="text-sm font-medium text-primary hover:underline">
                    ¿Has olvidado la contraseña?
                  </Link>
                </div>
              </div>

              {/* SUBMIT */}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting
                }
              >
                {isSubmitting
                  ? "Ingresando..."
                  : "Iniciar sesión"}
              </Button>
            </form>

            <SocialAuthButtons />

            {/* REGISTER */}

            <p
              className="
                text-center
                text-sm
                text-muted-foreground
              "
            >
              ¿No tenés cuenta?{" "}

              <Link
                to="/registro"
                className="
                  font-medium
                  text-primary
                  hover:underline
                "
              >
                Registrate
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
            <Dialog open={twoFAOpen} onOpenChange={setTwoFAOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Verificación en dos pasos</DialogTitle>
            <DialogDescription className="text-center">
              Por tu seguridad, vamos a enviarte un <strong>código de verificación</strong> de 6 dígitos al correo:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm font-medium text-foreground">
            <Mail size={16} className="text-primary" />
            {pendingCreds?.email}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            El código tiene una validez de 5 minutos.
          </p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setTwoFAOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSendCode} className="flex-1">
              Enviar código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;