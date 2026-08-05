import { initMercadoPago } from "@mercadopago/sdk-react";

const mercadopagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (mercadopagoPublicKey) {
  initMercadoPago(mercadopagoPublicKey, { locale: "es-AR" });
}
