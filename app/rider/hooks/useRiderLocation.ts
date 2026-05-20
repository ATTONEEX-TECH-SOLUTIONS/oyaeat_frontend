"use client";
import { useEffect, useRef } from 'react';

export function useRiderLocation(isOnline: boolean) {
  const watchIdRef = useRef<number | null>(null);
  
  // Dynamic fallback mapping path to capture your base URL configuration securely
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    // Kill the tracking process if rider is offline or browser lacks GPS hardware features
    if (!isOnline || !navigator.geolocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // Begin capturing ongoing device location shifts
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // ── CORRECTED ROUTE PATH: Combines base URL with your real /rider/location/ping backend endpoint ──
          const response = await fetch(`${API_BASE_URL}/rider/location/ping`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // ── CORRECTED KEY: Pulls riderToken to match your local storage assignment ──
              'Authorization': `Bearer ${localStorage.getItem('riderToken') || ''}`
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error(`Server returned status code: ${response.status}`);
          }

          console.log(`📡 GPS Live Stream Sync Success: [${latitude}, ${longitude}]`);
        } catch (error) {
          console.error("Failed to forward telemetry data packet down backend server:", error);
        }
      },
      (error) => {
        console.error("GPS tracking operational failure:", error.message);
      },
      {
        enableHighAccuracy: true, // Force phone hardware GPS instead of rough tower triangulation
        timeout: 10000,           // Throw error code timeout after 10 seconds of no answer
        maximumAge: 0             // Never use stale cached locations
      }
    );

    // Destructor hook teardown cleanup: prevent background processing leaks
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOnline, API_BASE_URL]);
}
