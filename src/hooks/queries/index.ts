// Re-exports for easy importing
export { useServices as default } from "./useServicesQuery";
export { useServices } from "./useServicesQuery";
export { useEmployees } from "./useEmployeesQuery";
export { useEspacios } from "./useEspaciosQuery";
export { useCanchas } from "./useCanchasQuery"; // alias deprecado
export { useTopCategories } from "./useTopCategories";
export { useCategoriesTree } from "./useCategoriesTree";
export { useAvailableSlots } from "./useAvailableSlots";
export { useHorarios } from "./useHorariosQuery";
export { useAppointments, getDayRange, getWeekRange } from "./useAppointmentsQuery";

import type { UseQueryResult } from "@tanstack/react-query";
import type {
  ApiServicio,
  ApiEmpleado,
  ApiCancha,
  ApiHorario,
} from "@/types/api";

export type ServicesQueryResult = UseQueryResult<ApiServicio[], Error>;
export type EmployeesQueryResult = UseQueryResult<ApiEmpleado[], Error>;
export type CanchasQueryResult = UseQueryResult<ApiCancha[], Error>;
export type HorariosQueryResult = UseQueryResult<ApiHorario[], Error>;

