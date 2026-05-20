"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Loader2, Bike } from "lucide-react";

interface RiderCoordinates {
  latitude: number;
  longitude: number;
  riderName: string;
}

export default function CustomerTrackingMap({ orderId }: { orderId: number }) {
  const [riderCoords, setRiderCoords] = useState<RiderCoordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const checkRiderPosition = async () => {
      try {
        const token = localStorage.getItem("customer_token");
        
        // Build a secure endpoint under orders controller that returns order.rider.shiftLogs row data
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/track-rider`, {
          headers: { "Authorization": `Bearer ${token || ""}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Expects backend format: { latitude: number, longitude: number, riderName: string }
          if (data.latitude && data.longitude) {
            setRiderCoords(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer rider tracking tracking parameters:", err);
      } finally {
        setLoading(false);
      }
    };

    checkRiderPosition();
    // Poll position details dynamically every 8 seconds
    const interval = setInterval(checkRiderPosition, 8000);
    return () => clearInterval(interval);
  }, [orderId, API_BASE_URL]);

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (!riderCoords) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-xl text-center font-medium">
        ⏳ Your meal is being carefully prepared. The live tracking map will unlock as soon as a rider claims the trip!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
        <span className="animate-pulse">🚴</span>
        <span className="font-semibold">Rider {riderCoords.riderName} is en route with your delivery order!</span>
      </div>

      <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <Map
            defaultZoom={14}
            center={{ lat: riderCoords.latitude, lng: riderCoords.longitude }}
            mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}
            disableDefaultUI={true}
            zoomControl={true}
          >
            <AdvancedMarker position={{ lat: riderCoords.latitude, lng: riderCoords.longitude }}>
              <div className="h-10 w-10 rounded-full bg-white shadow-lg border-2 border-emerald-600 flex items-center justify-center text-xl animate-bounce">
                🍔
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
