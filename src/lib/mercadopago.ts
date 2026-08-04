import { initMercadoPago } from "@mercadopago/sdk-react";

const mercadopagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const backendUrl =
  import.meta.env.VITE_BACKEND_URL ??
  import.meta.env.VITE_API_URL ??
  "undefined";
const frontendUrl =
  import.meta.env.VITE_FRONTEND_URL ??
  (typeof window !== "undefined" ? window.location.origin : "undefined");

console.log("[MP DIAG] BACKEND_URL =", backendUrl);
console.log("[MP DIAG] FRONTEND_URL =", frontendUrl);
console.log(
  `[MP DIAG] public_key_prefix=${mercadopagoPublicKey?.slice(0, 10)}`
);
console.log(
  "[MP DIAG] public_key_present =",
  Boolean(mercadopagoPublicKey)
);

if (mercadopagoPublicKey) {
  initMercadoPago(mercadopagoPublicKey, { locale: "es-AR" });
  console.log("[MP DIAG] initMercadoPago called");
}
