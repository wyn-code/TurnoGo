import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type TermsAndConditionsDialogProps = {
  trigger: ReactNode;
};

export default function TermsAndConditionsDialog({
  trigger,
}: TermsAndConditionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones de Uso - TurnoGo</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Última actualización:</strong>{" "}
              7 de mayo de 2026
            </p>
            <p>
              Bienvenido a TurnoGo. Al registrarse y utilizar la plataforma, el
              usuario acepta los siguientes términos y condiciones.
            </p>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                1. Sobre la plataforma
              </h3>
              <p>
                TurnoGo es una plataforma digital destinada a facilitar la
                gestión de turnos, reservas y servicios entre negocios y
                clientes.
              </p>
              <p>
                TurnoGo actúa únicamente como intermediario tecnológico y no
                participa directamente en la prestación de los servicios
                ofrecidos por los negocios registrados.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                2. Responsabilidad de los negocios
              </h3>
              <p>Cada negocio registrado es el único responsable de:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>La veracidad de la información publicada.</li>
                <li>Los servicios ofrecidos.</li>
                <li>Los precios publicados.</li>
                <li>La atención al cliente.</li>
                <li>El cumplimiento de turnos y reservas.</li>
                <li>La emisión de facturas o comprobantes.</li>
                <li>El cumplimiento de leyes y regulaciones aplicables.</li>
              </ul>
              <p>
                TurnoGo no garantiza la autenticidad, legalidad o calidad de los
                negocios publicados dentro de la plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                3. Negocios falsos o fraudulentos
              </h3>
              <p>
                TurnoGo no se responsabiliza por negocios falsos, fraudulentos o
                engañosos creados por terceros dentro de la plataforma.
              </p>
              <p>
                En caso de detectar actividad sospechosa, TurnoGo podrá
                suspender o eliminar cuentas sin previo aviso.
              </p>
              <p>
                Los usuarios aceptan utilizar la plataforma bajo su propia
                responsabilidad.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                4. Pagos y transacciones
              </h3>
              <p>TurnoGo no es responsable por:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Pagos realizados entre usuarios y negocios.</li>
                <li>Transferencias bancarias.</li>
                <li>Estafas.</li>
                <li>Reembolsos.</li>
                <li>Cancelaciones.</li>
                <li>Incumplimientos de servicio.</li>
                <li>Problemas derivados de plataformas de pago externas.</li>
              </ul>
              <p>
                Toda transacción realizada entre clientes y negocios es
                responsabilidad exclusiva de las partes involucradas.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                5. Disponibilidad del servicio
              </h3>
              <p>
                TurnoGo no garantiza disponibilidad ininterrumpida de la
                plataforma.
              </p>
              <p>La plataforma puede presentar:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>errores,</li>
                <li>interrupciones,</li>
                <li>mantenimiento,</li>
                <li>fallas técnicas,</li>
                <li>o pérdida temporal de información.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                6. Uso indebido
              </h3>
              <p>Está prohibido utilizar TurnoGo para:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>actividades ilegales,</li>
                <li>suplantación de identidad,</li>
                <li>publicación de información falsa,</li>
                <li>spam,</li>
                <li>fraude,</li>
                <li>contenido ofensivo o engañoso.</li>
              </ul>
              <p>
                TurnoGo podrá suspender cuentas que incumplan estas reglas.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                7. Protección de datos
              </h3>
              <p>
                TurnoGo podrá almacenar información básica de usuarios y negocios
                para el funcionamiento de la plataforma.
              </p>
              <p>
                Al utilizar el servicio, el usuario acepta el tratamiento de sus
                datos conforme a la legislación aplicable.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                8. Limitación de responsabilidad
              </h3>
              <p>TurnoGo no será responsable por:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>daños directos o indirectos,</li>
                <li>pérdida de ingresos,</li>
                <li>pérdida de clientes,</li>
                <li>conflictos entre usuarios y negocios,</li>
                <li>errores en reservas,</li>
                <li>cancelaciones,</li>
                <li>incumplimientos de servicios.</li>
              </ul>
              <p>
                El uso de la plataforma es bajo responsabilidad exclusiva del
                usuario.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">
                9. Modificaciones
              </h3>
              <p>
                TurnoGo podrá modificar estos términos y condiciones en cualquier
                momento.
              </p>
              <p>
                Las modificaciones entrarán en vigencia una vez publicadas en la
                plataforma.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
