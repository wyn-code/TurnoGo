---
name: fix-business-hours
user-invocable: true
description: "Guía paso a paso para corregir el error de carga de días y horarios de los negocios en Turnexo_front."
---

# Fix de carga de días y horarios de negocios

Este skill ayuda a identificar y corregir el problema de que los horarios y los días habilitados de un negocio no se cargan en el flujo de reserva.

## Cuándo usarlo

- Cuando el calendario de reservas muestra días no disponibles o sin horarios.
- Cuando en la consola aparece un error `404` para `GET /api/horarios/{id}`.
- Cuando el negocio tiene `horarios` en la API pero no se muestran en `Reservar.tsx`.

## Pasos recomendados

1. Reproducir el error en la ruta de reserva.
   - Seleccionar un negocio en `Reservar.tsx` y abrir la ficha de disponibilidad.
   - Observar la consola y la pestaña Red para detectar `GET /api/horarios/{id}` o `/api/horarios`.

2. Confirmar el endpoint usado por la API.
   - Revisar `src/services/horario.service.ts` y `src/lib/api-config.ts`.
   - Asegurar que `getByBusiness(id)` utiliza la ruta correcta frente al backend.

3. Revisar la lógica de carga en `src/pages/reserva/Reservar.tsx`.
   - Verificar si `businessData.horarios` está presente o vacío.
   - Confirmar que no se descarta la carga cuando `horariosData.length === 0`.

4. Revisar el modelo y el mapeo de días.
   - Verificar `src/types/api.ts` para el tipo `ApiHorario`.
   - Revisar `src/lib/schedule-utils.ts` para la conversión `dia_semana` → día de la semana.
   - Asegurar que `dia_semana` y el valor de `Date.getDay()` coinciden con el backend.

5. Ajustar la ruta o las conversiones si hay inconsistencias.
   - Si el backend expone `/businesses/{id}/schedules`, adaptar `horarioService`.
   - Si la API espera `dias` o `dia_semana` distinto, normalizarlo antes de usarlo.

6. Añadir mensajes de error más claros.
   - Agregar un `console.error` o toast con el error HTTP concreto.
   - Evitar ocultar la falla con un fallback silencioso.

7. Validar la corrección.
   - Confirmar que `business.horarios` se carga y tiene elementos.
   - Confirmar que el calendario muestra días habilitados en función del horario.
   - Confirmar que ya no aparece el `404` para `/api/horarios/{id}`.

## Criterios de éxito

- `GET /api/horarios/{id}` retorna `200` con horarios.
- `businessData.horarios` y `horariosData` se usan correctamente en `Reservar.tsx`.
- El calendario de reservas muestra los días habilitados y los horarios disponibles.
- No quedan errores 404 relacionados con horarios en la consola.

## Archivos clave

- `src/pages/reserva/Reservar.tsx`
- `src/services/horario.service.ts`
- `src/lib/api-config.ts`
- `src/types/api.ts`
- `src/lib/schedule-utils.ts`
