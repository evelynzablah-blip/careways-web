"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { MapLocation } from "@/lib/types";

export interface LeafletMapProps {
  locations: MapLocation[];
  selected: string | null;
  onSelect: (slug: string) => void;
  center: { lat: number; lng: number; zoom: number };
  label: string;
  countryLabel: (loc: MapLocation) => string;
}

function pinIcon(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="cw-pin${active ? " is-active" : ""}"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -28],
  });
}

function FlyToSelected({ locations, selected }: { locations: MapLocation[]; selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    const loc = locations.find((l) => l.slug === selected);
    if (!loc) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zoom = Math.max(map.getZoom(), 5);
    if (reduce) map.setView([loc.lat, loc.lng], zoom);
    else map.flyTo([loc.lat, loc.lng], zoom, { duration: 0.8 });
  }, [selected, locations, map]);
  return null;
}

export default function LeafletMap({ locations, selected, onSelect, center, label, countryLabel }: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={center.zoom}
      minZoom={3}
      maxZoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
      aria-label={label}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />
      {locations.map((loc) => (
        <Marker
          key={loc.slug}
          position={[loc.lat, loc.lng]}
          icon={pinIcon(loc.slug === selected)}
          title={`${countryLabel(loc)} — ${loc.hospital_name}`}
          alt={`${countryLabel(loc)} — ${loc.hospital_name}`}
          eventHandlers={{ click: () => onSelect(loc.slug) }}
        >
          <Tooltip direction="top" className="cw-tooltip">
            <strong>{countryLabel(loc)}</strong>
            <br />
            {loc.hospital_name}
          </Tooltip>
        </Marker>
      ))}
      <FlyToSelected locations={locations} selected={selected} />
    </MapContainer>
  );
}
