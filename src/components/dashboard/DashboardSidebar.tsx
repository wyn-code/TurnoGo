import { LayoutDashboard, CalendarDays, Briefcase, Users, Clock, Settings, Palette, Star, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Star size={16} className="text-primary" />
                <span>Turnexo</span>
              </div>
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
      </SidebarContent>
    </Sidebar>
  );
}
