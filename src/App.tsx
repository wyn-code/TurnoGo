import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/negocios" element={<Negocios />} />
            <Route path="/negocio/:slug" element={<NegocioPerfil />} />
            <Route path="/reservar/:slug" element={<Reservar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rutas protegidas — solo dueños de negocio */}
            <Route path="/registrar-negocio" element={<ProtectedRoute><RegistrarNegocio /></ProtectedRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin"element={<AdminRoute><AdminPanel /></AdminRoute>}/>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
