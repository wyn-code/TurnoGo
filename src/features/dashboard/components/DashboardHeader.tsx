import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ExternalLink, Crown } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { useMembership } from "@/features/membership/contexts/MembershipContext";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { logout } = useAuth();
  const { business } = useDashboardBusiness();
  const { planActual, loading } = useMembership();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {!loading && planActual && (
          <Badge variant="secondary" className="gap-1">
            <Crown size={12} />
            {planActual}
          </Badge>
        )}
        {business?.slug && (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/negocio/${business.slug}`}>
              <ExternalLink size={14} className="mr-1" /> Ver página
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={14} className="mr-1" /> Salir
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;