# 🛠️ GUÍA DE CORRECCIONES - CÓDIGO ESPECÍFICO

Este documento contiene ejemplos de código listos para implementar.

---

## 1. CONSOLIDAR SERVICIOS DE NEGOCIOS

### ❌ Estado actual (ELIMINAR después)

**Archivo: `src/services/negocio.service.ts`** → SERÁ DELETADO

```typescript
// Estos métodos se duplican en business.service.ts
export const negocioService = {
  getAll: async (): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/");
  },
  getAllAdmin: async (): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/admin");
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/negocios/${id}`);
  },
  update: async (
    id: number,
    data: Partial<ApiNegocio>,
  ): Promise<ApiNegocio> => {
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, data);
  },
};
```

### ✅ Solución: Actualizar `business.service.ts`

```typescript
import apiClient from "@/lib/api-client";
import type { ApiCategory, ApiNegocio } from "@/types/api";

export interface CreateBusinessResponse {
  id_negocio: number;
}

export interface CreateCompleteBusinessRequest {
  nombre: string;
  wsp: string;
  id_categoria: number;
  usuario_id: number;
  telefono: string | null;
  direccion: string;
  ciudad: string;
  id_localidad: number | null;
  id_provincia: number | null;
  ig_url: string | null;
  logo: string | null;
  activo: boolean;
  servicios: {
    nombre_servicio: string;
    precio: number;
    requiere_aprobacion: boolean;
    duracion_min: number;
    duracion_max: number;
    activo: boolean;
  }[];
  empleados: {
    nombre: string;
    apellido: string;
    telefono: string;
    activo: boolean;
  }[];
}

export const businessService = {
  // PÚBLICO: solo activos
  getAll: async (
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/", params);
  },

  // ADMIN: todos los negocios (activos e inactivos)
  getAllAdmin: async (): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/admin");
  },

  // Alias para compatibilidad
  getAllBusinesses: async (
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiNegocio[]> => {
    return businessService.getAll(params);
  },

  getBusinessById: async (id: string | number): Promise<ApiNegocio> => {
    return apiClient.get<ApiNegocio>(`/negocios/${id}`);
  },

  getBusinessBySlug: async (slug: string): Promise<ApiNegocio> => {
    const data = await businessService.getAll();
    const found = data.find((b) => b.slug === slug);
    if (!found) throw new Error("Negocio no encontrado");
    return found;
  },

  createCompleteBusiness: async (
    data: CreateCompleteBusinessRequest,
  ): Promise<CreateBusinessResponse> => {
    return apiClient.post<CreateBusinessResponse>("/negocios/complete", data);
  },

  getCategories: async (): Promise<ApiCategory[]> =>
    apiClient.get<ApiCategory[]>("/categorias/"),

  buildUpdatePayload: (
    business: ApiNegocio,
    changes: {
      nombre?: string;
      telefono?: string | null;
      wsp?: string;
      ig_url?: string | null;
      direccion?: string;
      ciudad?: string;
    },
  ) => {
    const usuarioId = business.usuario_id;
    if (usuarioId == null) {
      throw new Error("El negocio no tiene usuario_id asociado");
    }

    return {
      nombre: (changes.nombre ?? business.nombre).trim(),
      id_categoria: business.id_categoria,
      wsp: (changes.wsp ?? business.wsp).trim(),
      telefono:
        changes.telefono !== undefined ? changes.telefono : business.telefono,
      direccion: (changes.direccion ?? business.direccion).trim(),
      ciudad: (changes.ciudad ?? business.ciudad).trim(),
      id_localidad: business.id_localidad,
      id_provincia: business.id_provincia,
      ig_url: changes.ig_url !== undefined ? changes.ig_url : business.ig_url,
      logo: business.logo,
      activo: business.activo,
      usuario_id: usuarioId,
    };
  },

  updateBusiness: async (
    id: number,
    business: ApiNegocio,
    changes: {
      nombre?: string;
      telefono?: string | null;
      wsp?: string;
      ig_url?: string | null;
      direccion?: string;
      ciudad?: string;
    },
  ): Promise<ApiNegocio> => {
    const payload = businessService.buildUpdatePayload(business, changes);
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, payload);
  },

  // Eliminación (logical delete - soft delete)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/negocios/${id}`);
  },

  // Actualización genérica (para admin)
  update: async (
    id: number,
    data: Partial<ApiNegocio>,
  ): Promise<ApiNegocio> => {
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, data);
  },
};

export default businessService;
```

### Actualizar `src/services/api.ts`

```typescript
/**
 * DEPRECADO: Usar imports directos desde:
 * - "@/services/business.service" (para negocios)
 * - "@/services/servicio.service" (para servicios)
 * - "@/services/empleado.service" (para empleados)
 *
 * Se mantiene temporalmente solo por compatibilidad con código antiguo.
 *
 * PLAN DE MIGRACIÓN:
 * 1. Buscar todos los imports de "@/services"
 * 2. Reemplazar con imports específicos
 * 3. Eliminar este archivo en el próximo release
 */

// Compatibilidad temporal: re-export desde servicios por dominio.
export * from "./auth.service";
export * from "./business.service";
export * from "./appointment.service";
```

### Actualizar imports en todo el proyecto

```typescript
// ANTES (si usaba negocioService)
import { businessService } from "@/services/business.service";

// DESPUÉS
import { businessService } from "@/services/business.service";

// Si llamabas negocioService.getAll()
// Ahora es: businessService.getAll()

// Si llamabas negocioService.getAllAdmin()
// Ahora es: businessService.getAllAdmin()
```

---

## 2. REMOVER ANTI-PATRÓN: setState en useEffect

### ❌ ANTES: DashboardConfiguracion.tsx

```typescript
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

const DashboardConfiguracion = () => {
  const { business } = useDashboardBusiness();
  const [data, setData] = useState<ConfigFormData>(getFormFromBusiness(null));

  // ❌ ANTI-PATRÓN: syncronizar estado en useEffect
  useEffect(() => {
    if (!business) return;
    setData(getFormFromBusiness(business));
  }, [business]);

  // ... resto del componente
};
```

### ✅ DESPUÉS: Usar React Hook Form correctamente

```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const configSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  telefono: z.string().regex(/^\+?[0-9\s\-()]*$/, "Teléfono inválido").nullable().optional(),
  wsp: z.string().regex(/^\+?[0-9\s\-()]*$/, "WhatsApp inválido"),
  ig_url: z.string().url("URL inválida").nullable().optional(),
  direccion: z.string().min(5, "Dirección requerida"),
  ciudad: z.string().min(3, "Ciudad requerida"),
});

type ConfigFormData = z.infer<typeof configSchema>;

const DashboardConfiguracion = () => {
  const { business, isLoadingBusiness, refreshBusiness } = useDashboardBusiness();
  const { mutateAsync: updateBusiness, isPending } = useUpdateBusiness();

  // ✅ Inicializar formulario directamente
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      nombre: business?.nombre ?? "",
      telefono: business?.telefono ?? "",
      wsp: business?.wsp ?? "",
      ig_url: business?.ig_url ?? "",
      direccion: business?.direccion ?? "",
      ciudad: business?.ciudad ?? "",
    },
  });

  // ✅ SOLO si quieres syncronizar cuando business cambia
  if (business && form.formState.isDirty === false) {
    form.reset({
      nombre: business.nombre,
      telefono: business.telefono,
      wsp: business.wsp,
      ig_url: business.ig_url,
      direccion: business.direccion,
      ciudad: business.ciudad,
    });
  }

  const onSubmit = async (data: ConfigFormData) => {
    if (!business) {
      return toast.error("No hay negocio seleccionado");
    }

    try {
      await updateBusiness({
        business,
        changes: {
          nombre: data.nombre.trim(),
          telefono: data.telefono?.trim() || null,
          wsp: data.wsp.trim(),
          ig_url: data.ig_url?.trim() || null,
          direccion: data.direccion.trim(),
          ciudad: data.ciudad.trim(),
        },
      });
      await refreshBusiness();
      toast.success("Configuración guardada");
    } catch {
      // El hook ya muestra el error
    }
  };

  if (isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Configuración del negocio
        </h2>
        <Button size="sm" type="submit" form="config-form" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <Form {...form}>
            <form id="config-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del negocio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Barbería Don Carlos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 11 4567-8901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wsp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp *</FormLabel>
                      <FormControl>
                        <Input placeholder="+5491145678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ig_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@tunegocio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección *</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Principal 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Buenos Aires" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracion;
```

---

## 3. REMOVER JSON.stringify en Dependencies

### ❌ ANTES: DashboardHorarios.tsx

```typescript
useEffect(() => {
  if (apiHorarios) {
    setSchedule(mapHorariosToWeekSchedule(apiHorarios));
  }
}, [JSON.stringify(apiHorarios)]); // ❌ ANTI-PATRÓN
```

### ✅ DESPUÉS

```typescript
import { useEffect, useMemo, useState } from "react";

const DashboardHorarios = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ? String(business.id_negocio) : null;

  const { data: apiHorarios = [], isLoading, error } = useHorarios(businessId);
  const updateMutation = useUpdateHorarios();

  const [schedule, setSchedule] = useState<WeekSchedule>(defaultWeekSchedule);

  // ✅ CORRECTO: Usar apiHorarios directamente
  // React Query manejará la invalidación cuando los datos cambien
  useEffect(() => {
    if (apiHorarios.length > 0) {
      setSchedule(mapHorariosToWeekSchedule(apiHorarios));
    } else {
      setSchedule(defaultWeekSchedule);
    }
  }, [apiHorarios]); // Dependencia limpia y simple

  // ... resto del componente
};
```

---

## 4. CREAR CRUD COMPLETO: EMPLEADOS

### Paso 1: Crear `EmployeeForm.tsx`

```typescript
import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import type { ApiEmpleado } from "@/types/api";

const employeeSchema = z
  .object({
    nombre: z.string().min(2, "Mínimo 2 caracteres"),
    apellido: z.string().min(2, "Mínimo 2 caracteres"),
    telefono: z.string().regex(/^\+?[0-9\s\-()]+$/, "Teléfono inválido"),
    activo: z.boolean(),
  });

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

const defaultValues: EmployeeFormValues = {
  nombre: "",
  apellido: "",
  telefono: "",
  activo: true,
};

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  employee?: ApiEmpleado | null;
  isLoading?: boolean;
}

export function EmployeeForm({
  open,
  onOpenChange,
  onSubmit,
  employee,
  isLoading,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (employee) {
      form.reset({
        nombre: employee.nombre,
        apellido: employee.apellido,
        telefono: employee.telefono,
        activo: employee.activo,
      });
      return;
    }

    form.reset(defaultValues);
  }, [employee, open, form]);

  const handleInvalid = () => {
    const firstError = Object.values(form.formState.errors)[0];
    toast.error(
      firstError?.message?.toString() ??
        "Revisá los campos del formulario",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Editar profesional" : "Nuevo profesional"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="García" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+54 11 4567-8901" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Profesional activo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : employee
                  ? "Guardar cambios"
                  : "Crear profesional"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Paso 2: Crear hooks en `src/hooks/mutations/useCreateEmployee.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { empleadoService } from "@/services/empleado.service";
import type { ApiEmpleado } from "@/types/api";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id_negocio: number;
      nombre: string;
      apellido: string;
      telefono: string;
      activo: boolean;
    }) => empleadoService.create(data),

    onSuccess: (newEmployee) => {
      const businessKey = String(newEmployee.id_negocio);

      queryClient.setQueriesData<ApiEmpleado[]>(
        { queryKey: ["employees", businessKey] },
        (old) => {
          const list = old ?? [];
          if (list.some((e) => e.id_empleado === newEmployee.id_empleado)) {
            return list;
          }
          return [...list, newEmployee];
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["employees", businessKey],
      });
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error creando profesional"));
    },
  });
};

export default useCreateEmployee;
```

### Paso 3: Similar para `useUpdateEmployee.ts` y `useDeleteEmployee.ts`

```typescript
// useUpdateEmployee.ts
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        nombre?: string;
        apellido?: string;
        telefono?: string;
        activo?: boolean;
      };
    }) => empleadoService.update(id, data),

    onSuccess: (updatedEmployee) => {
      const businessKey = String(updatedEmployee.id_negocio);

      queryClient.setQueriesData<ApiEmpleado[]>(
        { queryKey: ["employees", businessKey] },
        (old) =>
          (old ?? []).map((e) =>
            e.id_empleado === updatedEmployee.id_empleado ? updatedEmployee : e,
          ),
      );

      queryClient.invalidateQueries({
        queryKey: ["employees", businessKey],
      });
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error actualizando profesional"));
    },
  });
};
```

### Paso 4: Actualizar `DashboardEmpleados.tsx`

```typescript
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, PowerOff, Power, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiEmpleado } from "@/types/api";
import { EmployeeForm, type EmployeeFormValues } from "./employees/EmployeeForm";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { useEmployees } from "@/hooks/queries/useEmployeesQuery";
import { useCreateEmployee } from "@/hooks/mutations/useCreateEmployee";
import { useUpdateEmployee } from "@/hooks/mutations/useUpdateEmployee";
import { useToggleEmployee } from "@/hooks/mutations/useToggleEmployee";

const DashboardEmpleados = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ? String(business.id_negocio) : null;
  const [showInactive, setShowInactive] = useState(false);

  const {
    data: employees = [],
    isLoading,
    error,
  } = useEmployees(businessId);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const toggleMutation = useToggleEmployee();

  const [selectedEmployee, setSelectedEmployee] = useState<ApiEmpleado | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredEmployees = showInactive
    ? employees
    : employees.filter((e) => e.activo);

  const handleSubmit = async (values: EmployeeFormValues) => {
    if (!businessId) return;

    try {
      if (selectedEmployee) {
        await updateMutation.mutateAsync({
          id: selectedEmployee.id_empleado,
          data: {
            nombre: values.nombre,
            apellido: values.apellido,
            telefono: values.telefono,
            activo: values.activo,
          },
        });
        toast.success("Profesional actualizado");
      } else {
        await createMutation.mutateAsync({
          id_negocio: Number(businessId),
          nombre: values.nombre,
          apellido: values.apellido,
          telefono: values.telefono,
          activo: values.activo,
        });
        toast.success("Profesional creado");
      }

      setIsFormOpen(false);
      setSelectedEmployee(null);
    } catch {
      // Los hooks ya muestran el error
    }
  };

  const handleToggle = async (employee: ApiEmpleado) => {
    try {
      await toggleMutation.mutateAsync(employee.id_empleado);
      toast.success(
        employee.activo ? "Profesional desactivado" : "Profesional reactivado",
      );
    } catch {
      // El hook ya muestra el error
    }
  };

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-8 text-center">
        <p className="text-destructive">
          Error cargando profesionales: {error.message}
        </p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Profesionales</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="show-inactive-employees"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label
                htmlFor="show-inactive-employees"
                className="cursor-pointer text-sm text-muted-foreground"
              >
                Ver inactivos
              </Label>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setSelectedEmployee(null);
                setIsFormOpen(true);
              }}
              disabled={createMutation.isPending}
            >
              <Plus size={14} className="mr-1" />
              Nuevo profesional
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id_empleado}
              className={!employee.activo ? "border-dashed opacity-90" : undefined}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">
                    {employee.nombre} {employee.apellido}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.telefono}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Badge
                    variant={employee.activo ? "secondary" : "outline"}
                    className={
                      employee.activo
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {employee.activo ? "Activo" : "Inactivo"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsFormOpen(true);
                    }}
                    disabled={updateMutation.isPending}
                    title="Editar"
                    aria-label={`Editar ${employee.nombre} ${employee.apellido}`}
                  >
                    <Edit size={14} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggle(employee)}
                    disabled={toggleMutation.isPending}
                    title={employee.activo ? "Desactivar" : "Reactivar"}
                    aria-label={employee.activo ? "Desactivar profesional" : "Reactivar profesional"}
                    className={
                      employee.activo
                        ? "text-muted-foreground hover:text-destructive"
                        : "text-primary hover:text-primary"
                    }
                  >
                    {employee.activo ? (
                      <PowerOff size={14} />
                    ) : (
                      <Power size={14} />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              {showInactive
                ? "No hay profesionales inactivos."
                : "No hay profesionales activos. Agregá uno para empezar."}
            </p>
          </div>
        )}
      </div>

      <EmployeeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        employee={selectedEmployee}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
};

export default DashboardEmpleados;
```

---

## 5. MEJORAR GESTIÓN DE CACHE

### ❌ ANTES: Redundancia setQueriesData + invalidateQueries

```typescript
onSuccess: (newService) => {
  const businessKey = String(newService.id_negocio);

  // Actualiza el cache
  queryClient.setQueriesData<ApiServicio[]>(
    { queryKey: ["services", businessKey] },
    (old) => [...list, newService],
  );

  // Invalida (fuerza refetch) - ❌ Redundante
  queryClient.invalidateQueries({
    queryKey: ["services", businessKey],
  });
};
```

### ✅ DESPUÉS: Solo actualizar cache

```typescript
onSuccess: (newService) => {
  const businessKey = String(newService.id_negocio);

  // Opción 1: Solo actualizar cache (recomendado)
  queryClient.setQueriesData<ApiServicio[]>(
    { queryKey: ["services", businessKey] },
    (old) => [...(old ?? []), newService],
  );

  // Opción 2: Si necesitas refetch (menos común)
  queryClient.invalidateQueries({
    queryKey: ["services", businessKey],
    exact: true,
  });
  // Pero NO hagas ambas a la vez
};
```

---

## 6. AGREGAR ACCESIBILIDAD

### Mejorar botones sin labels

```typescript
// ❌ ANTES: Sin accesibilidad
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleToggle(service)}
  title="Desactivar"
>
  <Power size={14} />
</Button>

// ✅ DESPUÉS: Con accesibilidad completa
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleToggle(service)}
  title={service.activo ? "Desactivar servicio" : "Reactivar servicio"}
  aria-label={service.activo ? `Desactivar ${service.nombre_servicio}` : `Reactivar ${service.nombre_servicio}`}
  aria-pressed={service.activo}
  className={
    service.activo
      ? "text-muted-foreground hover:text-destructive"
      : "text-primary hover:text-primary"
  }
>
  {service.activo ? <PowerOff size={14} /> : <Power size={14} />}
</Button>
```

---

## 7. FILTRADO EN MEMORIA: SOLUCIÓN CORRECTA

**Ubicación:** `src/services/servicio.service.ts:31-47`

### ❌ PROBLEMA ACTUAL

```typescript
getByBusiness: async (
  businessId: string | number,
  options?: GetServiciosOptions,
): Promise<ApiServicio[]> => {
  // Obtiene TODOS los servicios sin filtrar
  const data = await apiClient.get<ApiServicio[]>(BASE, {
    id_negocio: businessId,
  });

  // ❌ Filtra en MEMORIA después de traer todo
  const forBusiness = data.filter(
    (service) => String(service.id_negocio) === String(businessId),
  );

  if (options?.includeInactive) {
    return forBusiness;
  }

  // Filtra nuevamente en memoria por estado
  return forBusiness.filter((service) => service.activo);
};
```

**Por qué es problemático:**
1. El backend recibe `id_negocio` pero NO lo usa para filtrar
2. Si hay 10,000 servicios, carga TODOS en memoria
3. Dos filtraciones innecesarias en JavaScript
4. Escalabilidad pobre
5. Overhead de red y memoria

### ✅ SOLUCIÓN: CONFIAR EN EL BACKEND

**Opción 1: Backend filtrado (RECOMENDADO)**

```typescript
// El backend DEBERÍA hacer: GET /servicios/?id_negocio={id}&activo=true
// Entonces el frontend solo confía:

export const servicioService = {
  getByBusiness: async (
    businessId: string | number,
    options?: GetServiciosOptions,
  ): Promise<ApiServicio[]> => {
    // El backend ya filtra por id_negocio y por activo
    return apiClient.get<ApiServicio[]>(BASE, {
      id_negocio: businessId,
      // Parámetro para incluir inactivos si lo necesitas
      include_inactive: options?.includeInactive ?? false,
    });
  },

  create: async (data: ServicioCreatePayload): Promise<ApiServicio> => {
    const payload: ServicioCreatePayload = {
      id_negocio: Number(data.id_negocio),
      nombre_servicio: String(data.nombre_servicio).trim(),
      precio: Number(data.precio),
      duracion_min: Number(data.duracion_min),
      duracion_max: Number(data.duracion_max),
      requiere_aprobacion: Boolean(data.requiere_aprobacion),
      activo: Boolean(data.activo),
    };
    return apiClient.post<ApiServicio>(BASE, payload);
  },

  update: async (
    id: number,
    data: ServicioUpdatePayload,
  ): Promise<ApiServicio> => {
    const payload: ServicioUpdatePayload = {};

    // Validar que SOLO enviemos campos modificados
    if (data.nombre_servicio != null) {
      payload.nombre_servicio = String(data.nombre_servicio).trim();
    }
    if (data.precio != null) {
      payload.precio = Number(data.precio);
    }
    if (data.duracion_min != null) {
      payload.duracion_min = Number(data.duracion_min);
    }
    if (data.duracion_max != null) {
      payload.duracion_max = Number(data.duracion_max);
    }
    if (data.requiere_aprobacion != null) {
      payload.requiere_aprobacion = Boolean(data.requiere_aprobacion);
    }
    if (data.activo != null) {
      payload.activo = Boolean(data.activo);
    }

    return apiClient.put<ApiServicio>(`${BASE}${id}`, payload);
  },

  toggleStatus: async (id: number): Promise<ApiServicio> => {
    return apiClient.patch<ApiServicio>(`${BASE}${id}`);
  },

  delete: async (id: number): Promise<ApiServicio | void> => {
    const result = await apiClient.delete<ApiServicio | Record<string, never>>(
      `${BASE}${id}`,
    );

    if (result && "id_servicio" in result && result.id_servicio) {
      return result as ApiServicio;
    }

    return undefined;
  },
};
```

### ✅ ALTERNATIVA: Si NO puedes cambiar el backend

Si el backend NO filtra y no puedes modificarlo, usa esta solución optimizada:

```typescript
// Cachear el listado completo una sola vez
const allServicesCache = new Map<number, ApiServicio[]>();

export const servicioService = {
  getByBusiness: async (
    businessId: string | number,
    options?: GetServiciosOptions,
  ): Promise<ApiServicio[]> => {
    const id = Number(businessId);
    
    // Verificar si tenemos en caché
    if (allServicesCache.has(id)) {
      const cached = allServicesCache.get(id)!;
      
      if (options?.includeInactive) {
        return cached;
      }
      
      // Una sola filtración
      return cached.filter((service) => service.activo);
    }

    // Obtener del API
    const data = await apiClient.get<ApiServicio[]>(BASE);

    // Filtrar UNA SOLA VEZ al caché
    const forBusiness = data.filter(
      (service) => Number(service.id_negocio) === id,
    );

    // Guardar en caché
    allServicesCache.set(id, forBusiness);

    if (options?.includeInactive) {
      return forBusiness;
    }

    return forBusiness.filter((service) => service.activo);
  },
};
```

### 🎯 RECOMENDACIÓN FINAL

**Lo mejor:** Modifica el backend para que filtre:
```
GET /servicios/?id_negocio=123&include_inactive=false
```

Así el frontend es más simple y el backend es más eficiente (SQL es mejor que JS para filtrar).

---

Este documento complementa la auditoría principal. Implementa estos cambios en el orden especificado en el plan de prioridades.
