import { useEffect, useRef, useState } from "react";

// Satellite map using Leaflet + Esri World Imagery (no API key needed).
// Supports optional polygon drawing so farmers can mark field boundaries.
export default function SatelliteMap({
  fields = [],
  polygons = [],
  height = 480,
  center = [20.9020, 74.7749],
  zoom = 13,
  drawingEnabled = false,
  onPolygonComplete,
  focusedPolygonId = null,
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const LRef = useRef(null);
  const drawLayerRef = useRef(null);
  const tempLayerRef = useRef(null);
  const pointsRef = useRef([]);
  const lastFitFingerprintRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [pointCount, setPointCount] = useState(0);

  // Init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(ref.current, { zoomControl: true }).setView(center, zoom);
      mapRef.current = map;

      // Satellite imagery
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri", maxZoom: 19 }
      ).addTo(map);
      // Boundaries
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { opacity: 0.85, maxZoom: 19 }
      ).addTo(map);
      // Village / town / road labels (CartoDB labels-only)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
          opacity: 0.95,
          attribution: "© OpenStreetMap, © CARTO",
        }
      ).addTo(map);

      drawLayerRef.current = L.layerGroup().addTo(map);
      tempLayerRef.current = L.layerGroup().addTo(map);

      map.on("click", (e) => {
        if (!mapRef.current._isDrawing) return;
        pointsRef.current.push([e.latlng.lat, e.latlng.lng]);
        setPointCount(pointsRef.current.length);
        redrawTemp();
      });
      setMapReady(true);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line
  }, []);

  // Build a stable fingerprint so re-renders from unrelated state (e.g. point
  // count while drawing) don't trigger a re-fit / zoom-out.
  const fp = JSON.stringify([
    fields.map(f => [f?.id, f?.lat, f?.lng, f?.stress]),
    polygons.map(p => [p?.id, p?.coords, p?._statusColor]),
    focusedPolygonId,
  ]);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map || !drawLayerRef.current) return;
    drawLayerRef.current.clearLayers();

    const allLayers = [];
    let focusedLayer = null;

    fields.forEach((f) => {
      if (f?.lat == null || f?.lng == null) return;
      const color = f?.stress === "High" ? "#ef4444" : f?.stress === "Moderate" ? "#f59e0b" : "#22c55e";
      const marker = L.circleMarker([f.lat, f.lng], {
        radius: 9, color: "#ffffff", weight: 2, fillColor: color, fillOpacity: 0.9,
      }).addTo(drawLayerRef.current);
      marker.bindPopup(
        `<div style="font-family:system-ui;font-size:12px">
          <b>Field ${f.id}</b><br/>Crop: ${f.crop}<br/>Stage: ${f.stage || "—"}<br/>
          Stress: ${f.stress || "—"}
        </div>`
      );
      allLayers.push(marker);
    });

    polygons.forEach((p) => {
      if (!p?.coords?.length) return;
      const isFocused = focusedPolygonId != null && String(p.id) === String(focusedPolygonId);
      const poly = L.polygon(p.coords, {
        color: p._statusColor || (isFocused ? "#3b82f6" : "#22c55e"),
        weight: isFocused ? 4 : 2,
        fillOpacity: isFocused ? 0.38 : 0.25,
      })
        .addTo(drawLayerRef.current);
      poly.bindPopup(
        `<div style="font-family:system-ui;font-size:12px">
          <b>${p.name || "Field"}</b><br/>Crop: ${p.crop || "—"}<br/>Vertices: ${p.coords.length}
        </div>`
      );
      allLayers.push(poly);
      if (isFocused) focusedLayer = poly;
    });

    // Fit only when the real map data/focus changes, and never while drawing.
    // This keeps saved farmer fields visible on page load without zooming out
    // after every boundary point click.
    if (!map._isDrawing && allLayers.length && lastFitFingerprintRef.current !== fp) {
      try {
        const group = L.featureGroup(focusedLayer ? [focusedLayer] : allLayers);
        map.fitBounds(group.getBounds().pad(focusedLayer ? 0.6 : 0.3), { maxZoom: focusedLayer ? 18 : 17 });
        lastFitFingerprintRef.current = fp;
      } catch { /* noop */ }
    }
  }, [fp, mapReady]); // eslint-disable-line

  const redrawTemp = () => {
    const L = LRef.current; if (!L) return;
    tempLayerRef.current.clearLayers();
    const pts = pointsRef.current;
    pts.forEach((pt) => {
      L.circleMarker(pt, { radius: 5, color: "#fff", weight: 2, fillColor: "#22c55e", fillOpacity: 1 })
        .addTo(tempLayerRef.current);
    });
    if (pts.length >= 2) {
      L.polyline([...pts, ...(pts.length >= 3 ? [pts[0]] : [])], { color: "#22c55e", weight: 2, dashArray: "6 4" })
        .addTo(tempLayerRef.current);
    }
  };

  const startDraw = () => {
    pointsRef.current = [];
    setPointCount(0);
    tempLayerRef.current?.clearLayers();
    mapRef.current._isDrawing = true;
    setDrawing(true);
  };
  const cancelDraw = () => {
    pointsRef.current = [];
    setPointCount(0);
    tempLayerRef.current?.clearLayers();
    mapRef.current._isDrawing = false;
    setDrawing(false);
  };
  const finishDraw = () => {
    if (pointsRef.current.length < 3) return;
    const coords = [...pointsRef.current];
    onPolygonComplete?.(coords);
    cancelDraw();
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border" style={{ height }}>
      <div ref={ref} className="w-full h-full" />

      {drawingEnabled && (
        <div className="absolute top-3 left-3 z-[400] flex gap-2">
          {!drawing ? (
            <button onClick={startDraw} className="px-3 py-1.5 bg-success text-white rounded-md text-xs font-medium shadow">
              + Draw Field Boundary
            </button>
          ) : (
            <>
              <div className="px-3 py-1.5 bg-card/95 backdrop-blur rounded-md text-xs shadow">
                Click map to add points ({pointCount})
              </div>
              <button onClick={finishDraw} disabled={pointCount < 3}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium shadow disabled:opacity-50">
                Finish
              </button>
              <button onClick={cancelDraw} className="px-3 py-1.5 bg-muted rounded-md text-xs font-medium shadow">
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur rounded-lg p-3 text-xs space-y-1.5 shadow z-[400]">
        <p className="font-semibold">Legend</p>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-success" /> Healthy</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warning" /> Moderate Stress</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-destructive" /> High Stress</div>
      </div>
    </div>
  );
}
