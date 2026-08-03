import { initMercadoPago } from "@mercadopago/sdk-react";

const mercadopagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

// TEMP diag: prefix de la Public Key para verificar que es la de TEST
console.log(
  `[MP DIAG] public_key_prefix=${mercadopagoPublicKey?.slice(0, 10)}`
);

if (mercadopagoPublicKey) {
  initMercadoPago(mercadopagoPublicKey, { locale: "es-AR" });
}
