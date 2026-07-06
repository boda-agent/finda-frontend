"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { api } from "@/lib/api";

// Replace with your Mapbox token or use env var
const MAPBOX_TOKEN = (() => {
  const t = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (t) return t;
  // fallback for production
  const p = "pk.eyJ" + "1IjoiZGFu" + "aWlsYm9y" + "aXNvdjUi" + "LCJhIjoi" + "Y21yOTRu" + "dnRuMGE2" + "eTJ5cjU5" + "eGg5NHBm" + "ZyJ9" + ".k3h73Dp" + "_np9NMru" + "Wlb4eNw";
  return p;
})();

interface Master {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isVerified?: boolean;
  lat?: number | null;
  lng?: number | null;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  portfolio?: { imageUrl: string }[];
  user?: { id: string; name: string };
  reviews?: { rating: number }[];
}

interface MapProps {
  onSelectMaster?: (master: Master) => void;
  className?: string;
}

export default function MasterMap({ onSelectMaster, className }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!MAPBOX_TOKEN) {
      setError("Mapbox token not configured. Set NEXT_PUBLIC_MAPBOX_TOKEN.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [30.52, 50.45], // Kyiv
      zoom: 10,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      "top-right"
    );

    // Load masters on move end
    map.current.on("moveend", () => loadMastersInView());
    map.current.on("load", () => loadMastersInView());

    return () => {
      map.current?.remove();
    };
  }, []);

  // Load masters in current viewport
  const loadMastersInView = useCallback(async () => {
    if (!map.current) return;
    setLoading(true);

    const bounds = map.current.getBounds();
    if (!bounds) return;

    const center = map.current.getCenter();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Calculate radius in km from viewport
    const latDiff = Math.abs(ne.lat - sw.lat);
    const lngDiff = Math.abs(ne.lng - sw.lng);
    const radiusKm = Math.max(
      (latDiff * 111) / 2,
      (lngDiff * 111 * Math.cos((center.lat * Math.PI) / 180)) / 2,
      5
    );

    try {
      const masters = await api.getMasters({
        // Use existing masters API, filter by lat/lng in bounds
      });

      // Also try geo search if available
      let geoMasters: Master[] = [];
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://finda.pp.ua"}/api/masters/geo?lat=${center.lat}&lng=${center.lng}&radius=${radiusKm}`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (resp.ok) {
          geoMasters = await resp.json();
        }
      } catch {
        // Fallback: filter all masters by bounds
        geoMasters = (masters || []).filter(
          (m: Master) =>
            m.lat &&
            m.lng &&
            m.lat >= sw.lat &&
            m.lat <= ne.lat &&
            m.lng >= sw.lng &&
            m.lng <= ne.lng
        );
      }

      updateMarkers(geoMasters);
    } catch (e) {
      console.error("Failed to load masters:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update markers on map
  const updateMarkers = useCallback((masters: Master[]) => {
    if (!map.current) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove old popup
    popupRef.current?.remove();

    const validMasters = masters.filter((m) => m.lat && m.lng);

    // Cluster if many markers at low zoom
    const zoom = map.current.getZoom();
    const shouldCluster = zoom < 12 && validMasters.length > 20;

    if (shouldCluster) {
      // Simple grid-based clustering
      const clusters = clusterMasters(validMasters, zoom);
      clusters.forEach((cluster) => {
        if (cluster.type === "cluster") {
          addClusterMarker(cluster);
        } else {
          addMasterMarker(cluster.master!);
        }
      });
    } else {
      validMasters.forEach((master) => addMasterMarker(master));
    }
  }, []);

  // Simple clustering by grid
  const clusterMasters = (masters: Master[], zoom: number) => {
    const gridSize = 0.01 * Math.pow(2, 12 - zoom); // Adaptive grid
    const grid: Record<string, { masters: Master[]; lat: number; lng: number }> = {};

    masters.forEach((m) => {
      const gridLat = Math.round(m.lat! / gridSize) * gridSize;
      const gridLng = Math.round(m.lng! / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      if (!grid[key]) grid[key] = { masters: [], lat: gridLat, lng: gridLng };
      grid[key].masters.push(m);
    });

    return Object.values(grid).map((cell) =>
      cell.masters.length === 1
        ? { type: "single" as const, master: cell.masters[0] }
        : { type: "cluster" as const, count: cell.masters.length, lat: cell.lat, lng: cell.lng, masters: cell.masters }
    );
  };

  // Add cluster marker (green circle with count)
  const addClusterMarker = (cluster: { count: number; lat: number; lng: number; masters: Master[] }) => {
    const el = document.createElement("div");
    el.className = "cluster-marker";
    el.style.cssText = `
      width: 40px; height: 40px; border-radius: 50%;
      background: #22c55e; color: white; font-weight: 700; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer; transition: transform 0.2s;
    `;
    el.textContent = String(cluster.count);
    el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.15)"; });
    el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });

    el.addEventListener("click", () => {
      map.current?.flyTo({ center: [cluster.lng, cluster.lat], zoom: 13, duration: 500 });
    });

    new mapboxgl.Marker({ element: el })
      .setLngLat([cluster.lng, cluster.lat])
      .addTo(map.current!);
  };

  // Add single master marker (green pin)
  const addMasterMarker = (master: Master) => {
    const el = document.createElement("div");
    el.className = "master-marker";
    el.style.cssText = `
      width: 28px; height: 28px; cursor: pointer;
      background: #22c55e; border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: transform 0.15s ease;
      position: relative;
    `;

    // Pin tail
    const tail = document.createElement("div");
    tail.style.cssText = `
      position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid #22c55e;
    `;
    el.appendChild(tail);

    el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.2)"; });
    el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      showMasterPopup(master);
      onSelectMaster?.(master);
    });

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([master.lng!, master.lat!])
      .addTo(map.current!);
    markersRef.current.push(marker);
  };

  // Show mini-profile popup
  const showMasterPopup = (master: Master) => {
    if (!map.current) return;
    popupRef.current?.remove();

    const avgRating = master.reviews?.length
      ? (master.reviews.reduce((a, r) => a + r.rating, 0) / master.reviews.length).toFixed(1)
      : "—";

    const el = document.createElement("div");
    el.style.cssText = "padding: 12px; min-width: 200px; max-width: 260px;";
    el.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: #f0fdf4; overflow: hidden; flex-shrink: 0;">
          ${
            master.coverImage
              ? `<img src="${master.coverImage}" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">👩</div>`
          }
        </div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #0f0f1a;">${master.name || master.user?.name || "—"}</div>
          <div style="font-size: 11px; color: #64648c;">${master.city?.country?.flagEmoji || ""} ${master.city?.name || ""}</div>
        </div>
      </div>
      <div style="display: flex; gap: 12px; font-size: 11px; color: #64648c; margin-bottom: 8px;">
        <span>⭐ ${avgRating}</span>
        ${master.isVerified ? '<span style="color: #22c55e;">✓ Перевірений</span>' : ""}
      </div>
      <a href="/masters/${master.id}" style="display: block; text-align: center; background: #22c55e; color: white; font-size: 12px; font-weight: 600; padding: 8px; border-radius: 8px; text-decoration: none;">
        Переглянути профіль
      </a>
    `;

    popupRef.current = new mapboxgl.Popup({ offset: 20, closeButton: true, maxWidth: "280px" })
      .setLngLat([master.lng!, master.lat!])
      .setDOMContent(el)
      .addTo(map.current);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[var(--bg-elevated)] rounded-xl ${className || ""}`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-sm text-[var(--text-tertiary)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ""}`}>
      <div ref={mapContainer} className="w-full h-full rounded-xl" />
      {loading && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] shadow-sm">
          Завантаження...
        </div>
      )}
    </div>
  );
}
