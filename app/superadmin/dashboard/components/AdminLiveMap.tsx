"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Loader2 } from "lucide-react";

interface TrackedRider {
  riderId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  lastSeen: string;
}

export default function AdminLiveMap() {
  const [riders, setRiders] = useState<TrackedRider[]>([]);
  const [selectedRider, setSelectedRider] = useState<TrackedRider | null>(null);
  const [loading, setLoading] = useState(true);

  // Set default initial center coordinates to Lagos, Nigeria
  const [mapCenter, setMapCenter] = useState({ lat: 6.5244, lng: 3.3792 });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

 useEffect(() => {
  const fetchLiveTelemetry = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("authToken");
      
      // 1. Correct route URL path matching the backend mount
    
        const res = await fetch(`${API_BASE_URL}/admin/dashboard/live-riders`, {

        headers: { 
          "Authorization": `Bearer ${token || ""}` 
        }
      });
      
if (res.ok) {
  const data: TrackedRider[] = await res.json();
  
  if (Array.isArray(data)) {
    setRiders(data);

    if (data.length > 0 && data[0].latitude && data[0].longitude) {
      setMapCenter({
        lat: Number(data[0].latitude),
        lng: Number(data[0].longitude)
      });
    }
  }
}

    } catch (err) {
      console.error("Failed to sync live fleet mapping coordinates:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchLiveTelemetry();
  
  const interval = setInterval(fetchLiveTelemetry, 10000);
  return () => clearInterval(interval);
}, [API_BASE_URL]);


  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Active Fleet Operations</h3>
        <p className="text-sm text-gray-500">Live city tracking layout overlay pinning all online active riders.</p>
      </div>

      <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <Map
            defaultZoom={12}
            center={mapCenter}
            mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}
          >
            {riders.map((rider) => (
              <AdvancedMarker
                key={rider.riderId}
                position={{ lat: Number(rider.latitude), lng: Number(rider.longitude) }}
                onClick={() => setSelectedRider(rider)}
              >
                {/* Modern Custom Pin Design wrapper layout elements */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border-2 border-emerald-600 text-xl hover:scale-110 transition-transform cursor-pointer">
                  🏍️
                </div>
              </AdvancedMarker>
            ))}

            {selectedRider && (
              <InfoWindow
                position={{ lat: Number(selectedRider.latitude), lng: Number(selectedRider.longitude) }}
                onCloseClick={() => setSelectedRider(null)}
              >
                <div className="p-1 text-gray-900 min-w-[160px]">
                  <h4 className="font-bold text-sm">{selectedRider.firstName} {selectedRider.lastName}</h4>
                  <p className="text-xs text-gray-500 mt-1">Rider ID: #{selectedRider.riderId}</p>
                  <p className="text-xs text-gray-500">Mobile: {selectedRider.phone}</p>
                  <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1">
                    Last Seen: {new Date(selectedRider.lastSeen).toLocaleTimeString()}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
