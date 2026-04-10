/**
 * @deprecated PR1: evitar nuevos imports desde este barrel.
 * Usar imports directos desde:
 * - "@/services/auth.service"
 * - "@/services/business.service"
 * - "@/services/appointment.service"
 *
 * Se mantiene temporalmente solo por compatibilidad.
 */
// Compatibilidad temporal: re-export desde servicios por dominio.
export * from "./auth.service";
export * from "./business.service";
export * from "./appointment.service";
