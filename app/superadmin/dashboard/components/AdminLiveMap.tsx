"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Bike, Loader2, MapPinOff } from "lucide-react";
import { Panel } from "@/components/superadmin/ui";

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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchLiveTelemetry = async () => {
      try {
        const token =
          localStorage.getItem("admin_token");

        // 1. Correct route URL path matching the backend mount

        const res = await fetch(`${API_BASE_URL}/admin/dashboard/live-riders`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        if (res.ok) {
          const data: TrackedRider[] = await res.json();

          if (Array.isArray(data)) {
            setRiders(data);

            if (data.length > 0 && data[0].latitude && data[0].longitude) {
              setMapCenter({
                lat: Number(data[0].latitude),
                lng: Number(data[0].longitude),
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

  const hasKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Panel
      title="Live fleet"
      subtitle={loading ? "Syncing riders…" : `${riders.length} rider${riders.length === 1 ? "" : "s"} online`}
    >
      <div className="h-72 w-full overflow-hidden rounded-xl border border-border bg-violet-50 sm:h-96">
        {loading ? (
          <div className="grid h-full place-items-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : !hasKey ? (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <MapPinOff className="mx-auto h-8 w-8 text-violet-400" />
              <p className="mt-2 font-bold">Map unavailable</p>
              <p className="text-sm text-muted-foreground">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show live rider positions.</p>
            </div>
          </div>
        ) : (
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <Map defaultZoom={12} center={mapCenter} mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}>
              {riders.map((rider) => (
                <AdvancedMarker
                  key={rider.riderId}
                  position={{ lat: Number(rider.latitude), lng: Number(rider.longitude) }}
                  onClick={() => setSelectedRider(rider)}
                >
                  <div className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-primary bg-cta text-cta-foreground shadow-pop transition-transform hover:scale-110">
                    <Bike className="h-5 w-5" />
                  </div>
                </AdvancedMarker>
              ))}
              {selectedRider && (
                <InfoWindow
                  position={{ lat: Number(selectedRider.latitude), lng: Number(selectedRider.longitude) }}
                  onCloseClick={() => setSelectedRider(null)}
                >
                  <div className="min-w-[160px] p-1 text-gray-900">
                    <h4 className="text-sm font-bold">{selectedRider.firstName} {selectedRider.lastName}</h4>
                    <p className="mt-1 text-xs text-gray-500">Mobile: {selectedRider.phone}</p>
                    <p className="mt-2 border-t border-gray-100 pt-1 text-[10px] text-gray-400">
                      Last seen: {new Date(selectedRider.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        )}
      </div>
    </Panel>
  );
}
