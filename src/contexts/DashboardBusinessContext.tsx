import { createContext, useContext } from "react";
import type { ApiNegocio } from "@/types/api";

export interface DashboardBusinessContextValue {
  business: ApiNegocio | null;
  isLoadingBusiness: boolean;
}

const DashboardBusinessContext = createContext<DashboardBusinessContextValue | null>(null);

export function DashboardBusinessProvider({
  value,
  children,
}: {
  value: DashboardBusinessContextValue;
  children: React.ReactNode;
}) {
  return (
    <DashboardBusinessContext.Provider value={value}>
      {children}
    </DashboardBusinessContext.Provider>
  );
}

export function useDashboardBusiness() {
  const ctx = useContext(DashboardBusinessContext);
  if (!ctx) {
    throw new Error("useDashboardBusiness must be used within DashboardBusinessProvider");
  }
  return ctx;
}
