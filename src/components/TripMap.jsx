import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PLACE_CATEGORIES } from "../data/trip.js";

// A real map — OpenStreetMap data via CARTO's light tiles (no API key needed).
// Markers are category-coloured pins; only located places (with lat/lng) appear.
export default function TripMap({ places, days }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // located places in travel order (by day, then time) — this is the route
    const located = places
      .filter((p) => p.type !== "transfer" && Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .sort((a, b) => (a.dayD - b.dayD) || (a.time || "").localeCompare(b.time || ""));
    const map = L.map(el, { scrollWheelZoom: false, attributionControl: false }).setView([16, 107.5], 6);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);

    // the route line connecting every point in order
    if (located.length > 1) {
      L.polyline(located.map((p) => [p.lat, p.lng]), { color: "#2E8FF5", weight: 3, opacity: 0.6, dashArray: "1 9", lineCap: "round" }).addTo(map);
    }

    const markers = located.map((p, idx) => {
      const tone = PLACE_CATEGORIES[p.category]?.tone || "#2E3FB0";
      const day = days.find((d) => d.d === p.dayD);
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${tone};border:2px solid #fff;box-shadow:0 2px 5px rgba(20,18,14,.35);color:#fff;font:700 11px/1 'Plus Jakarta Sans',system-ui,sans-serif;display:flex;align-items:center;justify-content:center">${idx + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -13],
      });
      return L.marker([p.lat, p.lng], { icon })
        .bindPopup(`<b>${idx + 1}. ${p.name}</b><br>${p.category}${day ? " · " + day.d + " Oct" : ""}${p.area ? " · " + p.area : ""}`)
        .addTo(map);
    });

    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.25));
    }
    const t = setTimeout(() => map.invalidateSize(), 60);

    return () => { clearTimeout(t); map.remove(); };
  }, [places, days]);

  const locatedCount = places.filter((p) => p.type !== "transfer" && Number.isFinite(p.lat) && Number.isFinite(p.lng)).length;

  return (
    <div>
      <div ref={elRef} style={{ height: 540, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }} />
      <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 8 }}>
        {locatedCount} of {places.filter((p) => p.type !== "transfer").length} places on the map · add coordinates to a place (“Find on map” in its editor) to plot the rest.
      </div>
    </div>
  );
}
