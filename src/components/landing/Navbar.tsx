import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleUser, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-foreground">
          TurnGo
        </Link>

        {/* DESKTOP */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/negocios">Explorar negocios</Link>
          </Button>

          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center rounded-full border border-border/60 bg-background/70 p-2 backdrop-blur-md"
              >
                <CircleUser className="h-5 w-5" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 z-[9999] w-72 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
                  <div className="border-b border-border/50 px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">{user?.name || "Usuario"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Ir al Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => { logout(); navigate("/"); }}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center justify-center rounded-full border border-border/60 bg-background/70 p-2"
            >
              <CircleUser className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* MOBILE — botón hamburguesa */}
        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU DESPLEGABLE */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          
          {/* Info del usuario si está autenticado */}
          {isAuthenticated && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <CircleUser className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Links de navegación */}
          <div className="flex flex-col gap-1">
            <Link
              to="/negocios"
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Explorar negocios
            </Link>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Ir al Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => { logout(); navigate("/"); }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <CircleUser className="h-4 w-4" />
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;