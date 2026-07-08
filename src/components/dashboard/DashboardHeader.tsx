import { SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { logout } = useAuth();
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

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut size={14} className="mr-1" />
        Salir
      </Button>
    </header>
  );
};

export default DashboardHeader;