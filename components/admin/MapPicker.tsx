"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const icon = L.divIcon({ className: "", html: '<div class="cw-pin is-active"></div>', iconSize: [30, 30], iconAnchor: [15, 30] });

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onPick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))),
  });
  return null;
}

/** Click-to-place pin picker for the admin map form. */
export default function MapPicker({ lat, lng, onPick }: { lat: number | null; lng: number | null; onPick: (lat: number, lng: number) => void }) {
  const has = lat !== null && lng !== null && Number.isFinite(lat) && Number.isFinite(lng);
  return (
    <MapContainer center={has ? [lat!, lng!] : [9.54, -79.42]} zoom={has ? 6 : 4} className="h-80 w-full rounded-xl" scrollWheelZoom>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        subdomains="abcd"
      />
      <ClickHandler onPick={onPick} />
      {has && <Marker position={[lat!, lng!]} icon={icon} />}
    </MapContainer>
  );
}
