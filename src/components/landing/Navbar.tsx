import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const hideRegisterBusinessButton = location.pathname === "/login" || location.pathname === "/registro";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-foreground">
          Turnexo
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/negocios">Explorar negocios</Link>
          </Button>
          {!hideRegisterBusinessButton && (
            <Button size="sm" asChild>
              <Link to="/login" state={{ from: "/registrar-negocio" }}>Registrar mi negocio</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" className="justify-start" asChild>
              <Link to="/negocios">Explorar negocios</Link>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" asChild>
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            {!hideRegisterBusinessButton && (
              <Button size="sm" asChild>
                <Link to="/login" state={{ from: "/registrar-negocio" }}>Registrar mi negocio</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
