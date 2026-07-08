import { LayoutDashboard, CalendarDays, Briefcase, Users, Clock, Settings, Palette, CreditCard, ShieldCheck, Star, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link, useLocation } from "react-router-dom";
import { useMembership } from "@/features/membership/contexts/MembershipContext";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Resumen", url: "/dashboard", icon: LayoutDashboard },
  { title: "Turnos", url: "/dashboard/turnos", icon: CalendarDays },
  { title: "Servicios", url: "/dashboard/servicios", icon: Briefcase },
  { title: "Empleados", url: "/dashboard/empleados", icon: Users },
  { title: "Horarios", url: "/dashboard/horarios", icon: Clock },
  { title: "Estadísticas", url: "/dashboard/estadisticas", icon: BarChart3 },
  { title: "Configuración", url: "/dashboard/configuracion", icon: Settings },
  { title: "Personalización", url: "/dashboard/personalizacion", icon: Palette },
];

const membershipItems = [
  { title: "Mi Suscripción", url: "/mi-suscripcion", icon: ShieldCheck },
  { title: "Planes", url: "/planes", icon: CreditCard },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { planActual, loading } = useMembership();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Star size={16} className="text-primary" />
                <span>TurnoGo</span>
              </Link>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Membresía"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {membershipItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.title === "Mi Suscripción" && !loading && planActual && (
                        <Badge variant="outline" className="ml-auto text-xs capitalize">
                          {planActual}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
