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