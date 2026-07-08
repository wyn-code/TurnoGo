import { NavLink } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/negocios", label: "Negocios", icon: Building2 },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export function AdminNavbar() {
  return (
    <nav className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/60",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
