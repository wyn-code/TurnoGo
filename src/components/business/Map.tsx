import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  latitud: number;
  longitud: number;
  nombre: string;
}

export default function Map({
  latitud,
  longitud,
  nombre,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitud, latitud],
      zoom: 15,
    });

    new mapboxgl.Marker()
      .setLngLat([longitud, latitud])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<h3>${nombre}</h3>`
        )
      )
      .addTo(map);

    return () => map.remove();
  }, [latitud, longitud, nombre]);

return (
  <div
    ref={mapContainer}
    className="w-full h-[400px]"
  />
);
}