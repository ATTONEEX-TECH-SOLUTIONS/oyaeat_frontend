"use client";

import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface PickerProps {
  onLocationSelected: (coords: { lat: number; lng: number }) => void;
}

export default function RestaurantLocationPicker({ onLocationSelected }: PickerProps) {
  // Default to central operational market coordinates (e.g. Lagos, Nigeria)
  const [markerPos, setMarkerPos] = useState({ lat: 6.5244, lng: 3.3792 });

  // Capture where the restaurant owner clicks on the map grid frame canvas
  const handleMapClick = (e: any) => {
    if (!e.detail.latLng) return;
    
    const newCoords = {
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    };
    
    setMarkerPos(newCoords);
    onLocationSelected(newCoords); // Forwards numbers straight back up to your parent signup forms
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-700 mb-1">
          Pin Your Kitchen Location
        </label>
        <p className="text-xs text-zinc-400">
          Click directly on the map layout below to drop a pin precisely over your store entryway.
        </p>
      </div>

      <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-inner">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <Map
            defaultZoom={13}
            defaultCenter={markerPos}
            onClick={handleMapClick}
            mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}
            disableDefaultUI={true} // Clean minimal UI block frames
            zoomControl={true}
          >
            <Marker position={markerPos} draggable={true} />
          </Map>
        </APIProvider>
      </div>
      
      <div className="flex gap-4 text-xs font-mono text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
        <span>Latitude: {markerPos.lat.toFixed(6)}</span>
        <span>Longitude: {markerPos.lng.toFixed(6)}</span>
      </div>
    </div>
  );
}
