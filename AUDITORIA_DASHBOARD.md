# 🔍 AUDITORÍA PROFESIONAL - PANEL DE NEGOCIO (DASHBOARD) TURNEXO

**Fecha:** 2026-05-26  
**Scope:** Frontend React 19 + TypeScript + React Query  
**Reviewer:** Análisis Profesional Senior

---

## 📋 ÍNDICE
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Status de Funcionalidades](#status-de-funcionalidades)
3. [Hallazgos Críticos](#hallazgos-críticos)
4. [Análisis Técnico Detallado](#análisis-técnico-detallado)
5. [Plan de Mejoras](#plan-de-mejoras)

---

## 📊 RESUMEN EJECUTIVO

### Conclusión General
El panel está **parcialmente implementado**. El módulo de **Servicios** está bien arquitecturado, pero **Empleados** y **Turnos** carecen de funcionalidades CRUD. Existen problemas de arquitectura (duplicación de servicios), anti-patrones en React, e inconsistencias en TypeScript que requieren corrección inmediata.

### Calificación por Área
- **Funcionalidades:** 55% (falta Empleados y Turnos)
- **Arquitectura:** 65% (duplicación, inconsistencias)
- **React Patterns:** 70% (anti-patrones detectados)
- **TypeScript:** 60% (tipado inconsistente)
- **Testing:** 0% (no hay tests identificados)

---

## ✅ STATUS DE FUNCIONALIDADES

### Tabla Resumen

| Módulo | CREATE | READ | UPDATE | DELETE | TOGGLE | Status |
|--------|--------|------|--------|--------|--------|--------|
| **Servicios** | ✅ | ✅ | ✅ | ✅ (soft) | ✅ | **COMPLETO** |
| **Empleados** | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ INCOMPLETO |
| **Turnos** | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ INCOMPLETO |
| **Horarios** | N/A | ✅ | ✅ | N/A | N/A | **COMPLETO** |
| **Config. Negocio** | N/A | ✅ | ✅ | N/A | N/A | **COMPLETO** |
| **Resumen** | N/A | ✅ | N/A | N/A | N/A | **COMPLETO** |

### Detalles

#### ✅ Servicios - IMPLEMENTADO CORRECTAMENTE
```
✓ Lectura con caché (React Query)
✓ Creación de servicios
✓ Edición con validación (Zod)
✓ Eliminación lógica (soft-delete con toggle)
✓ Mostrar/ocultar inactivos
✓ Error handling y toasts
```

#### ⚠️ Empleados - FALTA IMPLEMENTACIÓN
```
✗ SIN botones de edición
✗ SIN formulario de crear/editar
✗ SIN eliminación (soft/hard)
✗ SIN toggle activo/inactivo
✗ SIN dialogs de confirmación
→ SOLO LECTURA (list)
```

**Impacto:** Imposible gestionar profesionales desde el dashboard.

#### ⚠️ Turnos - FALTA IMPLEMENTACIÓN
```
✗ SIN botones de creación
✗ SIN edición de turnos (reasignación, cambio de hora)
✗ SIN cancelación/eliminación
✗ SIN cambio de estado
→ SOLO LECTURA (list + filtros)
```

**Impacto:** Imposible gestionar agenda desde el dashboard.

---

## 🚨 HALLAZGOS CRÍTICOS

### 1. DUPLICACIÓN GRAVE: `business.service.ts` vs `negocio.service.ts`

**Ubicación:**
- `src/services/business.service.ts` (131 líneas)
- `src/services/negocio.service.ts` (28 líneas)

**Problema:**
Ambos servicios actúan sobre el mismo endpoint `/negocios/` pero con métodos inconsistentes:

```typescript
// business.service.ts - COMPLETO
getAllBusinesses()      // GET /negocios/
getBusinessById(id)     // GET /negocios/{id}
getBusinessBySlug(slug) // Búsqueda en memoria
createCompleteBusiness() // POST /negocios/complete
updateBusiness()        // PUT /negocios/{id}

// negocio.service.ts - SIMPLIFICADO
getAll()      // GET /negocios/ (igual que getAllBusinesses)
getAllAdmin() // GET /negocios/admin
delete()      // DELETE /negocios/{id}
update()      // PUT /negocios/{id} (igual que updateBusiness)
```

**Riesgos:**
- Confusión al importar
- Mantenimiento duplicado
- `api.ts` ya está deprecado intentando consolidar
- Si cambias endpoint, tienes que actualizar 2 archivos

**Recomendación:**
Fusionar todo en `business.service.ts` y eliminar `negocio.service.ts`.

---

### 2. ANTI-PATRÓN: React Hooks Deshabilitado

**Ubicación:** `DashboardConfiguracion.tsx:1` y `DashboardHorarios.tsx:1`

```typescript
/* eslint-disable react-hooks/set-state-in-effect */
useEffect(() => {
  if (business) {
    setData(getFormFromBusiness(business));
  }
}, [business]);
```

**Problema:**
- Estás deshabilitando el linter porque estás violando la regla
- Esto causa renders innecesarios y puede generar bugs sutiles
- El useEffect debería actualizar el form, no el estado

**Solución Correcta:**
```typescript
// Opción 1: Usar form.reset() en lugar de setData
useEffect(() => {
  if (business) {
    form.reset(getFormFromBusiness(business));
  }
}, [business, form]);

// Opción 2: Inicializar el form directamente
const form = useForm({
  defaultValues: getFormFromBusiness(business),
  // ...
});
```

---

### 3. INEFICIENCIA: JSON.stringify como dependencia

**Ubicación:** `DashboardHorarios.tsx:36`

```typescript
useEffect(() => {
  if (apiHorarios) {
    setSchedule(mapHorariosToWeekSchedule(apiHorarios));
  }
}, [JSON.stringify(apiHorarios)]); // ❌ ANTI-PATRÓN
```

**Problema:**
- `JSON.stringify()` se ejecuta en cada render
- No es determinístico si hay objetos con propiedades en diferente orden
- React Query ya hace tracking de cambios automáticamente

**Solución:**
```typescript
useEffect(() => {
  if (apiHorarios.length > 0) {
    setSchedule(mapHorariosToWeekSchedule(apiHorarios));
  }
}, [apiHorarios]); // React Query maneja invalidación
```

---

### 4. INCONSISTENCIA: Naming en Español e Inglés

**Ubicación:** `src/types/api.ts`

```typescript
// En español (backend)
export interface ApiNegocio { /* ... */ }
export interface ApiServicio { /* ... */ }
export interface ApiEmpleado { /* ... */ }

// Aliases en inglés (compatibilidad)
export type ApiBusiness = ApiNegocio;
export type ApiService = ApiServicio;
export type ApiEmployee = ApiEmpleado;

// Pero en BookingData: camelCase
export interface BookingData {
  serviceId: string;      // camelCase
  professionalId: string;
  // ...
}
```

**Problema:**
- Imposible saber qué naming usar al escribir nuevo código
- Los aliases generan confusión
- El REST API usa snake_case

**Recomendación:**
Estandarizar a snake_case (como el backend) o crear un layer de transformación.

---

### 5. GESTIÓN DE CACHE REDUNDANTE

**Ubicación:** `useCreateService.ts:15-28` y similares

```typescript
onSuccess: (newService) => {
  // Primero: actualiza manualmente el cache
  queryClient.setQueriesData<ApiServicio[]>(
    { queryKey: ["services", businessKey] },
    (old) => [...list, newService],
  );
  
  // Segundo: invalida (fuerza refetch)
  queryClient.invalidateQueries({
    queryKey: ["services", businessKey],
  });
};
```

**Problema:**
- `invalidateQueries` fuerza un refetch, por lo que `setQueriesData` es innecesario
- Es trabajo duplicado
- Causa 2 requests en lugar de 1

**Solución:**
```typescript
onSuccess: (newService) => {
  // Solo uno: actualizar el cache
  queryClient.setQueriesData<ApiServicio[]>(
    { queryKey: ["services", businessKey] },
    (old) => [...(old ?? []), newService],
  );
};
```

---

### 6. FALTA DE VALIDACIÓN FRONTEND

**Ubicación:** `DashboardConfiguracion.tsx:56-62`

```typescript
// Validación manual, sin Zod
if (!data.nombre.trim() || !data.wsp.trim()) {
  return toast.error("Nombre y WhatsApp son obligatorios");
}
```

**Problema:**
- `ServiceForm` usa Zod, esto no
- Inconsistencia de patrones
- Difícil de mantener

**Recomendación:**
Usar React Hook Form + Zod (como `ServiceForm`):

```typescript
const configSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  wsp: z.string().regex(/^[0-9+\s\-()]+$/, "Formato de teléfono inválido"),
  direccion: z.string().min(5, "Dirección requerida"),
  // ...
});
```

---

### 7. SUPRESIÓN SILENCIOSA DE ERRORES

**Ubicación:** `DashboardServicios.tsx:87`

```typescript
void runToggle(service).catch(() => {}); // ❌ Ignora error
```

**Problema:**
- El error ocurre pero no se muestra al usuario
- El usuario no sabe si la acción falló
- Difícil de debuggear

**Solución:**
```typescript
const handleStatusClick = async (service: ApiServicio) => {
  if (service.activo) {
    setServiceToDeactivate(service);
  } else {
    try {
      await runToggle(service);
    } catch (error) {
      toast.error("Error al reactivar");
    }
  }
};
```

---

### 8. FILTRADO EN MEMORIA EN LUGAR DE API

**Ubicación:** `servicio.service.ts:31-47`

```typescript
getByBusiness: async (businessId, options?) => {
  const data = await apiClient.get<ApiServicio[]>(BASE, {
    id_negocio: businessId,
  });

  // Filtra en MEMORIA en lugar del backend
  const forBusiness = data.filter(
    (service) => String(service.id_negocio) === String(businessId),
  );

  if (options?.includeInactive) {
    return forBusiness;
  }
  return forBusiness.filter((service) => service.activo);
};
```

**Problema:**
- El backend debería hacer el filtrado
- Si hay 10,000 servicios se cargan todos en memoria
- Ineficiente
- El backend ya recibe `id_negocio` como parámetro

**Recomendación:**
El backend debe filtrar directamente en SQL.

---

## 📐 ANÁLISIS TÉCNICO DETALLADO

### ARQUITECTURA Y ESTRUCTURA

#### ✅ Fortalezas

1. **Separación clara de responsabilidades:**
   - `src/pages/dashboard/` → Páginas (contenedores)
   - `src/services/` → Lógica de API
   - `src/hooks/` → Queries y Mutations
   - `src/contexts/` → Estado global

2. **React Query bien implementado:**
   - Cache configuration (5 min staleTime, 10 min gcTime)
   - Query keys centralizadas en funciones
   - Mutations con optimistic updates

3. **Componentes reutilizables:**
   - `ServiceForm` exportado para reutilizar
   - Dialogs separados (`DeactivateServiceDialog`)

#### ⚠️ Problemas

1. **Servicios duplicados:**
   - `business.service.ts` + `negocio.service.ts`
   - `api.ts` está deprecado pero no removido
   - Falta consolidación

2. **Falta de tipos para respuestas:**
   ```typescript
   // ❌ No existe
   export type ServiceResponse = ApiServicio;
   export type CreateServiceRequest = ServicioCreatePayload;
   
   // ❌ Tipos en múltiples lugares
   // servicio.service.ts → ServicioCreatePayload
   // business.service.ts → CreateCompleteBusinessRequest
   ```

3. **Context simple pero sin mutations:**
   - `DashboardBusinessContext` solo carga datos
   - Las mutations están en hooks separados
   - Podrían estar centralizadas en el context

---

### REACT HOOKS Y PATTERNS

#### ✅ Lo que funciona bien

1. **useQuery bien configurado:**
   ```typescript
   useQuery<ApiServicio[], Error>({
     queryKey: getServicesQueryKey(businessId, { includeInactive }),
     queryFn: () => servicioService.getByBusiness(businessId, { includeInactive }),
     enabled: businessId != null,
     staleTime: 5 * 60 * 1000,
     gcTime: 10 * 60 * 1000,
   });
   ```

2. **useMutation con invalidación:**
   - Actualiza cache correctamente
   - Muestra toasts de error
   - Usa `getApiErrorMessage` centralizado

3. **Form reset en ServiceForm:**
   ```typescript
   useEffect(() => {
     if (service) {
       form.reset({ /* valores */ });
     }
   }, [service, open, form]);
   ```

#### ❌ Anti-patrones encontrados

1. **useState en lugar de form.reset:**
   - `DashboardConfiguracion` usa `setData` en useEffect
   - Debería usar React Hook Form directamente

2. **Falta de dependency arrays:**
   - Algunos useEffect tienen dependencias incompletas
   - Puede causar race conditions

3. **useMemo innecesarios:**
   - `DashboardResumen.tsx:64` - stats array es simple
   - `DashboardTurnos.tsx:62` - sortedAppointments podría ser una función

---

### TYPESCRIPT Y TIPADO

#### Problemas Identificados

1. **Tipado incompleto en servicios:**
   ```typescript
   // ❌ Retorna any implícitamente
   getByBusiness: async (businessId) => { /* ... */ }
   
   // ✅ Debería ser
   getByBusiness: async (
     businessId: string | number,
     options?: GetServiciosOptions,
   ): Promise<ApiServicio[]> => { /* ... */ }
   ```

2. **Inconsistencia de interfaces:**
   ```typescript
   // Los tipos están esparcidos en varios archivos
   export type ServicioCreatePayload = { /* */ }      // servicio.service.ts
   export type CreateCompleteBusinessRequest = { /* */ } // business.service.ts
   export interface BusinessConfigChanges { /* */ }   // useBusinessService.ts
   ```

3. **Falta de tipos para errores:**
   ```typescript
   // ❌ Error types genéricos
   onError: (error) => { /* type: Error */ }
   
   // ✅ Debería ser específico
   type ApiError = { code: string; message: string; detail?: string };
   ```

---

### GESTIÓN DE ESTADO Y CACHE

#### React Query

**Configuración actual (BUENA):**
- `staleTime: 5 * 60 * 1000` - Datos frescos por 5 min
- `gcTime: 10 * 60 * 1000` - Cache guardado por 10 min
- `enabled: businessId != null` - Previene requests innecesarios

**Mejoras recomendadas:**
```typescript
// Agregar retry logic
retry: (failureCount, error) => {
  if (error instanceof Error && error.message === "Not Found") {
    return false; // No reintentar 404s
  }
  return failureCount < 3;
},

// Agregar timeout
queryFn: async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    return await servicioService.getByBusiness(businessId, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
},
```

#### Contextos

`DashboardBusinessContext` es simple pero efectivo:
```typescript
interface DashboardBusinessContextValue {
  business: ApiNegocio | null;
  isLoadingBusiness: boolean;
  refreshBusiness: () => Promise<void>;
}
```

**Falta:** Hook para mutations de business (crear, editar, eliminar negocios).

---

### FORMULARIOS Y VALIDACIONES

#### ✅ ServiceForm - CORRECTAMENTE IMPLEMENTADO

```typescript
const serviceSchema = z
  .object({
    nombre_servicio: z.string().min(3, "Mínimo 3 caracteres"),
    precio: z.number().min(1, "El precio debe ser mayor a 0"),
    duracion_min: z.number().min(1),
    duracion_max: z.number().min(1),
    requiere_aprobacion: z.boolean(),
    activo: z.boolean(),
  })
  .refine((data) => data.duracion_max >= data.duracion_min, {
    message: "La duración máxima debe ser mayor o igual a la mínima",
    path: ["duracion_max"],
  });
```

**Fortalezas:**
- Validación con Zod
- Refine para validaciones cruzadas
- Manejo correcto de numeros en inputs
- Reset en open/close

**Mejoras:**
```typescript
// Agregar validación de precio para evitar 0
precio: z.number().min(0.01, "Precio mínimo $0.01"),

// Agregar validación de caracteres especiales
nombre_servicio: z.string()
  .min(3, "Mínimo 3 caracteres")
  .max(100, "Máximo 100 caracteres")
  .regex(/^[a-zA-Z0-9\s\-áéíóúñ]+$/, "Caracteres inválidos"),
```

#### ⚠️ DashboardConfiguracion - SIN VALIDACIÓN CON SCHEMA

```typescript
// ❌ Validación manual
const handleSave = async () => {
  if (!data.nombre.trim() || !data.wsp.trim()) {
    return toast.error("Nombre y WhatsApp son obligatorios");
  }
  // ...
};
```

**Debería ser:**
```typescript
const configSchema = z.object({
  nombre: z.string().min(3).max(100),
  telefono: z.string().regex(/^\+?[0-9\s\-()]*$/).optional().nullable(),
  wsp: z.string().regex(/^\+?[0-9\s\-()]*$/),
  ig_url: z.string().url().optional().nullable(),
  direccion: z.string().min(5),
  ciudad: z.string().min(3),
});

const form = useForm<z.infer<typeof configSchema>>({
  resolver: zodResolver(configSchema),
  defaultValues: getFormFromBusiness(business),
});
```

---

### DIALOGS Y MODALES

**Implementación actual:**
- `ServiceForm` → Dialog bien estructurado
- `DeactivateServiceDialog` → Confirmación simple

**Falta implementar:**
- Dialog para crear/editar empleados
- Dialog para crear/editar turnos
- Dialogs de confirmación para deletes

---

### ERROR HANDLING

#### Estado Actual

**Bueno:**
```typescript
// useServices query
if (error) {
  return (
    <div className="rounded-lg border border-destructive p-8 text-center">
      <p className="text-destructive">
        Error cargando servicios: {error.message}
      </p>
    </div>
  );
}
```

**Problemas:**
1. Error message genérico del usuario - no sabe qué falló
2. Falta retry button
3. No hay diferenciación entre tipos de error

**Recomendación:**
```typescript
function getErrorMessage(error: Error): string {
  if (error.message.includes("404")) {
    return "No se encontraron servicios para este negocio";
  }
  if (error.message.includes("401")) {
    return "Tu sesión expiró. Por favor, inicia sesión nuevamente";
  }
  if (error.message.includes("500")) {
    return "Error del servidor. Intenta de nuevo más tarde";
  }
  return "Error al cargar servicios. Intenta de nuevo";
}

if (error) {
  return (
    <div className="rounded-lg border border-destructive p-8 text-center">
      <p className="text-destructive">{getErrorMessage(error)}</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => refetch()}
        className="mt-3"
      >
        Reintentar
      </Button>
    </div>
  );
}
```

---

### UX/UI Y ACCESIBILIDAD

#### ✅ Positivos

1. **Loading states bien implementados:**
   - Spinners en lugar de contenido oscuro
   - Colocados estratégicamente

2. **Estados vacíos claros:**
   ```typescript
   {services.length === 0 && (
     <div className="rounded-lg border border-dashed p-8 text-center">
       <p className="text-muted-foreground">
         No hay servicios activos. Activá «Ver inactivos» para reactivar uno.
       </p>
     </div>
   )}
   ```

3. **Badges y colores coherentes:**
   - Verde para activo
   - Gris para inactivo
   - Rojo para destructivo

#### ⚠️ Problemas de Accesibilidad

1. **Falta de ARIA labels:**
   ```typescript
   // ❌ Sin accesibilidad
   <Button
     variant="ghost"
     size="icon"
     onClick={() => { setSelectedService(s); setIsFormOpen(true); }}
     title="Editar" // Solo en hover
   >
     <Edit size={14} />
   </Button>
   
   // ✅ Correcto
   <Button
     variant="ghost"
     size="icon"
     onClick={() => { /* */ }}
     title="Editar"
     aria-label="Editar servicio"
   >
     <Edit size={14} />
   </Button>
   ```

2. **Falta de focus management en dialogs:**
   - Los dialogs de shadcn/ui tienen soporte, pero no se documenta
   
3. **Colores sin suficiente contraste:**
   ```typescript
   className="text-muted-foreground" // Bajo contraste
   ```

4. **Falta de validaciones en submit:**
   ```typescript
   // Debería tener aria-required
   <Input
     value={data.nombre}
     onChange={(e) => update("nombre", e.target.value)}
     aria-required="true"
     aria-invalid={!!errors.nombre}
   />
   ```

---

### SEGURIDAD

#### ✅ Lo que está bien

1. **No expones tokens en localStorage:**
   - Usando seguramente apiClient (centralizado)

2. **No hay SQL injection:**
   - Estás usando parámetros, no string concatenation

3. **CORS configurado en backend:**
   - Las requests son a través de API centralizado

#### ⚠️ Concerns

1. **No hay rate limiting frontend:**
   - El usuario puede hacer múltiples requests rápidamente
   - Debería debounce en inputs

2. **No hay validación de permisos:**
   - ¿Puede el usuario editar cualquier negocio?
   - ¿Hay authorization checks?

3. **Falta de confirmación en deletes:**
   - El toggle de servicios tiene confirmación (bueno)
   - ¿Pero qué de empleados y turnos?

**Recomendación:**
```typescript
// Agregar debounce para ediciones
const debouncedSave = useMemo(
  () => debounce((changes: BusinessConfigChanges) => {
    updateBusiness(changes);
  }, 1000),
  [updateBusiness]
);
```

---

### PERFORMANCE

#### Problemas Identificados

1. **JSON.stringify en dependencies:**
   - `DashboardHorarios.tsx:36` recalcula cada render

2. **Sin lazy loading:**
   - Todas las páginas cargan con anticipation

3. **Sin virtualización:**
   - Si hay muchos servicios/empleados, performance degrada

4. **Renders innecesarios:**
   - `DashboardConfiguracion` renderiza form completo en cada `business` change

#### Métricas a medir

```typescript
// Agregar para medir performance
import { useEffect } from "react";

function DashboardServicios() {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`DashboardServicios rendered in ${end - start}ms`);
    };
  }, []);
  // ...
}
```

---

## 🎯 PLAN DE MEJORAS

### Prioridad CRÍTICA (Hacer inmediatamente)

#### 1. Consolidar servicios de negocios
```
Tarea: Fusionar business.service.ts + negocio.service.ts
Duración: 2 horas
Impacto: Alto - elimina confusión arquitectónica

Pasos:
1. Revisar qué métodos se usan en cada archivo
2. Mantener los completos en business.service.ts
3. Actualizar imports
4. Eliminar negocio.service.ts
5. Remover deprecation de api.ts
```

#### 2. Implementar CRUD de Empleados
```
Tarea: Agregar funcionalidad CRUD completa
Duración: 4-5 horas
Impacto: Alto - usuarios no pueden gestionar personal

Pasos:
1. Crear EmployeeForm.tsx (similar a ServiceForm)
2. Crear empleado.service.ts con create/update métodos
3. Crear hooks: useCreateEmployee, useUpdateEmployee, useDeleteEmployee
4. Actualizar DashboardEmpleados con botones y dialog
5. Agregar validaciones con Zod
```

#### 3. Implementar CRUD de Turnos (básico)
```
Tarea: Agregar creación y cancelación de turnos
Duración: 5-6 horas
Impacto: Alto - core del negocio

Pasos:
1. Crear AppointmentForm.tsx
2. Crear appointment.service.ts con create/cancel métodos
3. Crear hooks para mutations
4. Actualizar DashboardTurnos
5. Agregar validación de horarios disponibles
```

#### 4. Remover anti-patrones en React
```
Tarea: Limpiar eslint-disable y anti-patrones
Duración: 2 horas
Impacto: Medio - mejora calidad de código

Archivos:
- DashboardConfiguracion.tsx → Remover eslint-disable, usar form.reset()
- DashboardHorarios.tsx → Remover JSON.stringify dependency
```

---

### Prioridad ALTA (Hacer en el sprint siguiente)

#### 5. Estandarizar TypeScript
```
Tarea: Consolidar tipos y schemas
Duración: 3 horas

Crear archivo: src/types/schemas.ts
- Todos los payloads (Create, Update, etc.)
- Tipos de error API
- Tipos de request/response
```

#### 6. Agregar validaciones con Zod
```
Tarea: Migrar validaciones manuales a schemas Zod
Duración: 3 horas

Archivos:
- DashboardConfiguracion.tsx
- DashboardHorarios.tsx
```

#### 7. Mejorar error handling
```
Tarea: Centralizar manejo de errores
Duración: 2 horas

Crear: src/lib/error-handler.ts
- Funciones para parsear errores API
- Mensajes amigables al usuario
- Retry logic
```

#### 8. Tests unitarios
```
Tarea: Agregar cobertura de tests
Duración: 8-10 horas

Mínimo:
- Hooks (queries y mutations)
- Servicios
- Componentes críticos (ServiceForm)
```

---

### Prioridad MEDIA (Cuando estés estable)

#### 9. Optimizaciones de performance
```
- Lazy loading de páginas
- React.memo() en componentes reutilizables
- Virtualización si hay muchos items
- Code splitting
```

#### 10. Accesibilidad
```
- Agregar ARIA labels
- Testing con keyboard
- Testing con screen readers
- Validar contraste de colores
```

#### 11. Documentación
```
- Swagger/OpenAPI para API
- JSDoc en funciones complejas
- README de arquitectura
- Guía de contribución
```

---

## 🔄 FLUJO DE TRABAJO RECOMENDADO

```
Semana 1:
┌─────────────────────┐
│ 1. Consolidar servicios
│ 2. CRUD Empleados
│ 3. Remover anti-patrones
└─────────────────────┘

Semana 2:
┌─────────────────────┐
│ 4. CRUD Turnos (básico)
│ 5. TypeScript estandarización
│ 6. Validaciones Zod
└─────────────────────┘

Semana 3:
┌─────────────────────┐
│ 7. Error handling
│ 8. Tests unitarios
│ 9. Review completo
└─────────────────────┘
```

---

## 📋 CHECKLIST DE VALIDACIÓN

Antes de dar por "completo" el dashboard:

- [ ] Todos los CRUD (CREATE, READ, UPDATE, DELETE, TOGGLE) funcionan
- [ ] Validaciones en frontend con Zod
- [ ] Error handling coherente
- [ ] Loading states en todos lados
- [ ] SIN eslint-disable en hooks
- [ ] TypeScript strict mode sin any
- [ ] Tests unitarios > 80% cobertura
- [ ] Accesibilidad WCAG 2.1 AA
- [ ] Performance Lighthouse > 90
- [ ] Documentación de API actualizada

---

## 🔧 CONFIGURACIÓN RECOMENDADA

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### .eslintrc
```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-types": "warn"
  }
}
```

---

## 📞 CONTACTO PARA ACLARACIONES

Si durante la implementación encuentras:
- Conflictos de requisitos
- Incompatibilidades con el backend
- Casos especiales no documentados

**Verificar con:**
- Backend (FastAPI) si hay discrepancias de schema
- Product si hay cambios en spec
- QA para confirmar casos de uso edge

---

**Fin de Auditoría**  
*Este documento es un blueprint técnico. Ajusta según tus prioridades de negocio.*
