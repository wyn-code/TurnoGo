import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { obtenerNegociosMapa } from "@/services/business.service";
import type { NegocioMapa } from "@/types/api";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapaPage() {
  const mapContainer = useRef<HTMLDivElement>(null);

  const [negocios, setNegocios] = useState<NegocioMapa[]>([]);

  useEffect(() => {
    obtenerNegociosMapa().then(setNegocios);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-60.214656, -33.32819],
      zoom: 12,
    });

    negocios.forEach((negocio) => {
      if (negocio.latitud == null || negocio.longitud == null) return;

      new mapboxgl.Marker()
        .setLngLat([negocio.longitud, negocio.latitud])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
      <h3>${negocio.nombre}</h3>
    `),
        )
        .addTo(map);
    });

    return () => map.remove();
  }, [negocios]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
