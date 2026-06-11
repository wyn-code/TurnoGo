import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Negocios from "./pages/Negocios.tsx";
import NegocioPerfil from "./pages/NegocioPerfil.tsx";
import Reservar from "./pages/reserva/Reservar.tsx";
import Login from "./pages/Login.tsx";
import Registro from "./pages/Registro.tsx";
import RegistrarNegocio from "./pages/registrar-negocio/RegistrarNegocio.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import { AdminRoute } from "./components/admin/AdminRoute.tsx";
import OlvideContrasena from "./pages/OlvideContrasena.tsx";
import RestablecerContrasena from "./pages/RestablecerContrasena.tsx";
import 'mapbox-gl/dist/mapbox-gl.css';
const queryClient = new QueryClient();

const ROUTES_WITHOUT_PAGE_ANIMATION = new Set(["/login", "/registro"]);

const AppRoutes = () => {
  const location = useLocation();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const isAnimationDisabled = ROUTES_WITHOUT_PAGE_ANIMATION.has(location.pathname);

  const routes = (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/negocios" element={<Negocios />} />
      <Route path="/negocio/:slug" element={<NegocioPerfil />} />
      <Route path="/reservar/:slug" element={<Reservar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />

      {/* Rutas protegidas — solo dueños de negocio */}
      <Route path="/registrar-negocio" element={<ProtectedRoute><RegistrarNegocio /></ProtectedRoute>} />
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  useEffect(() => {
    if (isAnimationDisabled) return;

    const container = pageContainerRef.current;
    if (!container) return;

    const pageRoot = container.firstElementChild as HTMLElement | null;
    if (!pageRoot) return;

    const uniqueCandidates = new Set<HTMLElement>();
    const directChildren = Array.from(pageRoot.children) as HTMLElement[];
    const semanticBlocks = Array.from(
      pageRoot.querySelectorAll("section, article, form, [data-scroll-reveal]")
    ) as HTMLElement[];

    directChildren.forEach((element) => {
      if (element.offsetHeight > 24) uniqueCandidates.add(element);
    });

    semanticBlocks.forEach((element) => uniqueCandidates.add(element));

    const candidates = Array.from(uniqueCandidates);
    if (candidates.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    candidates.forEach((element) => {
      element.classList.add("scroll-reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isAnimationDisabled, location.pathname]);

  if (isAnimationDisabled) {
    return routes;
  }

  return (
    <div key={location.pathname} ref={pageContainerRef} className="page-enter">
      {routes}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
