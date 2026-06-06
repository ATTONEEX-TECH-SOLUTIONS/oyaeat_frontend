"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Loader2 } from "lucide-react";
import { StatusBlockOverlay } from "@/components/dashboard/StatusBlockOverlay";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActiveDeliveryCard } from "@/components/dashboard/ActiveDeliveryCard";
import { RecentDeliveriesLog } from "@/components/dashboard/RecentDeliveriesLog";
import { LiveMatchModal } from "@/components/dashboard/LiveMatchModal";

interface IncomingOrderAlert {
  orderId: number;
  restaurantName: string;
  payout: number;
  distance: string;
  dropoffAddress: string;
}

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation] = useState("Lagos Island, Lagos");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<IncomingOrderAlert | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const watchIdRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const riderStatus = dashboardData?.riderProfile?.status || dashboardData?.status || "pending";
  const isAccountRestricted = riderStatus !== "active";

  //  Live Telemetry streaming engine
  useEffect(() => {
    if (!isOnline || isAccountRestricted || !navigator.geolocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("riderToken");
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await fetch(`${API_BASE_URL}/rider/location/ping`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ latitude, longitude }),
          });
        } catch (error) {
          console.error("Telemetry Sync Failure:", error);
        }
      },
      (error) => console.error("GPS Process Failure:", error.message),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOnline, isAccountRestricted, API_BASE_URL]);

  //  WebSocket Event Router
  useEffect(() => {
    if (!isOnline || isAccountRestricted) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("riderToken");
    if (!token) return;

    socketRef.current = io(API_BASE_URL, { auth: { token } });
    socketRef.current.on("NEW_DELIVERY_REQUEST", (orderData: IncomingOrderAlert) => {
      setIncomingRequest(orderData);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOnline, isAccountRestricted, API_BASE_URL]);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("riderToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setIsOnline(data.status === "active" ? data.isOnline : false); 
      }
    } catch (err) {
      console.error("Dashboard payload fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleToggleShift = async () => {
    if (isAccountRestricted) return;
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      const response = await fetch(`${API_BASE_URL}/rider/shift/toggle`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.ok) {
        const result = await response.json();
        setIsOnline(result.status === "online");
        await fetchDashboard();
      }
    } catch (err) {
      console.error("Shift execution modification error:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAcceptOrder = async (orderIdString: string) => {
    if (isAccountRestricted) return;
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      const cleanId = orderIdString.replace("ORD-", "");
      const response = await fetch(`${API_BASE_URL}/rider/orders/${cleanId}/accept`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.ok) {
        await fetchDashboard();
      }
    } catch (err) {
      console.error("Error accepting active trip layout:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCompleteDelivery = async (orderIdString: string) => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      const cleanId = orderIdString.replace("ORD-", "");
      const response = await fetch(`${API_BASE_URL}/rider/orders/${cleanId}/complete`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.ok) {
        await fetchDashboard();
      }
    } catch (err) {
      console.error("Error writing dropoff verification:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (isAccountRestricted) {
    return <StatusBlockOverlay riderStatus={riderStatus} />;
  }

  const activeDelivery = isOnline && dashboardData?.activeDelivery ? dashboardData.activeDelivery : null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative bg-slate-50 min-h-screen">
      <DashboardHeader 
        firstName={dashboardData?.profile?.firstName} 
        currentLocation={dashboardData?.currentLocation || currentLocation}
        isOnline={isOnline}
        isActionLoading={isActionLoading}
        onToggleShift={handleToggleShift}
      />

      <StatsGrid statsData={dashboardData?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ActiveDeliveryCard 
            activeDelivery={activeDelivery}
            isOnline={isOnline}
            isActionLoading={isActionLoading}
            onAccept={handleAcceptOrder}
            onComplete={handleCompleteDelivery}
          />
        </div>
        
        <div>
          <RecentDeliveriesLog recentDeliveries={dashboardData?.recentDeliveries} />
        </div>
      </div>

      {incomingRequest && (
        <LiveMatchModal 
          incomingRequest={incomingRequest} 
          onClose={() => setIncomingRequest(null)}
          onAccept={handleAcceptOrder}
        />
      )}
    </div>
  );
}
