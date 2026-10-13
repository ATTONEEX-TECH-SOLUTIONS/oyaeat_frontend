"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  } from "@vis.gl/react-google-maps";
import { Loader2, Bike } from "lucide-react";
import { API_URL } from "@/lib/customer";

interface RiderCoordinates {
  latitude: number;
  longitude: number;
  riderName: string;
}

export default function CustomerTrackingMap({ orderId }: { orderId: number }) {
  const [riderCoords, setRiderCoords] = useState<RiderCoordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = API_URL;

  useEffect(() => {
    const checkRiderPosition = async () => {
      try {
        const token = localStorage.getItem("customer_token");

        // Build a secure endpoint under orders controller that returns order.rider.shiftLogs row data
        const res = await fetch(
          `${API_BASE_URL}/orders/${orderId}/track-rider`,
          {
            headers: { Authorization: `Bearer ${token || ""}` },
          },
        );

        if (res.ok) {
          const data = await res.json();
          // Expects backend format: { latitude: number, longitude: number, riderName: string }
          if (data.latitude && data.longitude) {
            setRiderCoords(data);
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch customer rider tracking tracking parameters:",
          err,
        );
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
      <div className="flex h-72 w-full items-center justify-center bg-violet-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!riderCoords) {
    return (
      <div className="flex items-center gap-4 bg-violet-50 p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-primary">
          <Bike className="h-5 w-5" />
        </span>
        <div>
          <p className="font-bold text-violet-900">Waiting for your rider&apos;s location</p>
          <p className="text-sm text-violet-800/80">
            The live map appears here as soon as the rider starts moving.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-border bg-mango-50 px-4 py-3 text-sm font-bold text-mango-800">
        <Bike className="h-4 w-4" />
        {riderCoords.riderName} is on the way with your order
      </div>
      <div className="h-72 w-full sm:h-80">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <Map
            defaultZoom={14}
            center={{ lat: riderCoords.latitude, lng: riderCoords.longitude }}
            mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}
            disableDefaultUI={true}
            zoomControl={true}
          >
            <AdvancedMarker
              position={{ lat: riderCoords.latitude, lng: riderCoords.longitude }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-primary bg-cta text-cta-foreground shadow-pop">
                <Bike className="h-5 w-5" />
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
