"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Wallet,
  MapPin,
  Clock,
  ChevronRight,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BellRing,
  X
} from "lucide-react";

interface IncomingOrderAlert {
  orderId: number;
  restaurantName: string;
  payout: number;
  distance: string;
  dropoffAddress: string;
}

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Lagos Island, Lagos");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // ── NEW STATE: ACTIVE OVERLAY ALERTS ──
  const [incomingRequest, setIncomingRequest] = useState<IncomingOrderAlert | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const watchIdRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // 📡 BACKGROUND LIVE GEOLOCATION COORDINATES STREAMING SYSTEM
  useEffect(() => {
    if (!isOnline || !navigator.geolocation) {
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
          const response = await fetch(`${API_BASE_URL}/rider/location/ping`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (response.ok) {
            console.log(`📡 GPS Telemetry Synchronized: [${latitude}, ${longitude}]`);
          }
        } catch (error) {
          console.error("Failed to forward telemetry data packet down server:", error);
        }
      },
      (error) => {
        console.error("GPS Watch Position Process Failure:", error.message);
      },
      {
        enableHighAccuracy: true, 
        timeout: 12000,           
        maximumAge: 0             
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOnline, API_BASE_URL]);

  // 🔌 NEW BACKGROUND WEBSOCKET LISTENER FOR DISPATCH ALERTS
  useEffect(() => {
    if (!isOnline) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("riderToken");
    if (!token) return;

    // Connect to your WebSocket server instance securely
    socketRef.current = io(API_BASE_URL, {
      auth: { token }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("WebSocket handshaking rejected:", err.message);
    });

    // Listen for incoming dynamic matching alerts from Express dispatcher
    socketRef.current.on("NEW_DELIVERY_REQUEST", (orderData: IncomingOrderAlert) => {
      console.log("🎯 Live delivery match event caught via socket:", orderData);
      setIncomingRequest(orderData); // Launches instant alert popups on screen!
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOnline, API_BASE_URL]);

  // Reusable wrapper function to poll operational database records
  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("riderToken");
      if (!token) {
        console.warn("No authentication token found! Please log in as a rider.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setIsOnline(data.isOnline); 
      }
    } catch (err) {
      console.error("Failed to load dashboard payload properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // 1. Shift Toggle State Integration
  const handleToggleShift = async () => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      
      const response = await fetch(`${API_BASE_URL}/rider/shift/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const result = await response.json();
        setIsOnline(result.status === "online");
        await fetchDashboard();
      }
    } catch (err) {
      console.error("Shift processing state modification failure:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // 2. Accept Order Workflow
  const handleAcceptOrder = async (orderIdString: string) => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      const cleanId = orderIdString.replace("ORD-", "");

      const response = await fetch(`${API_BASE_URL}/rider/orders/${cleanId}/accept`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        alert("Order assigned cleanly to your tracking log!");
        await fetchDashboard();
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to accept order");
      }
    } catch (err) {
      console.error("Error updating active delivery layout", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // 3. Confirm Delivery Drops Action
  const handleCompleteDelivery = async (orderIdString: string) => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("riderToken");
      const cleanId = orderIdString.replace("ORD-", "");

      const response = await fetch(`${API_BASE_URL}/rider/orders/${cleanId}/complete`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        alert("Delivery completed successfully! Payout balances locked.");
        await fetchDashboard();
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to complete delivery");
      }
    } catch (err) {
      console.error("Error completing delivery configuration updates:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const stats = [
    { label: "Today's Earnings", value: dashboardData?.stats?.todayEarnings || "₦0", icon: Wallet, color: "text-green-600", bg: "bg-green-100" },
    { label: "Completed Today", value: dashboardData?.stats?.completedToday || "0", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Hours Online", value: dashboardData?.stats?.hoursOnline || "0h 0m", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const activeDelivery = isOnline && dashboardData?.activeDelivery ? dashboardData.activeDelivery : null;
  const recentDeliveries = dashboardData?.recentDeliveries || [];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">

      {/* Header & Status Toggle area layout view */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {dashboardData?.profile?.firstName || "Rider"}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            Current Location: <span className="font-medium text-gray-700">{dashboardData?.currentLocation || currentLocation}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 pr-4 rounded-full border border-gray-200">
          <button
            onClick={handleToggleShift}
            disabled={isActionLoading}
            className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out outline-none border-none ${isOnline ? 'bg-green-500' : 'bg-gray-300'
              } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isOnline ? 'translate-x-8' : 'translate-x-0'
                }`}
            />
          </button>
          <span className={`font-bold text-sm uppercase tracking-wider ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {isActionLoading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
          </span>
        </div>
      </div>

      {/* Live tracking background state pulse indicator card row layout */}
      {isOnline && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl flex items-center gap-2 text-xs animate-pulse">
          <span>📡</span>
          <span>Live Tracking & Radio Active: Your real-time position is streaming to dispatch.</span>
        </div>
      )}

      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 px-6 py-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-500" />
          <div>
            <h3 className="font-semibold">You are currently offline</h3>
            <p className="text-sm mt-1 text-orange-700/80">Toggle your status to "Go Online" to start receiving delivery requests.</p>
          </div>
        </div>
      )}

      {/* Stats Grid layout maps info elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Structural split columns system grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Section: Dynamic Request Map Cards */}
        <div className="lg:col-span-2 space-y-6">
          {activeDelivery ? (
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      {activeDelivery.status === "out_for_delivery" ? "Active Trip" : "New Request"}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{activeDelivery.payout} <span className="text-sm font-normal text-gray-500">Est. Payout</span></h2>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{activeDelivery.distance || "3.2 km"}</p>
                    <p className="text-sm text-gray-500">Total Distance</p>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-4 border-gray-900 rounded-full z-10" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup</p>
                      <p className="font-bold text-gray-900">{activeDelivery.restaurant}</p>
                      <p className="text-sm text-gray-500">Status: <span className="capitalize font-medium text-green-700">{activeDelivery.status.replace(/_/g, ' ')}</span></p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-4 border-green-500 rounded-full z-10" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dropoff</p>
                      <p className="font-bold text-gray-900">{activeDelivery.customer}</p>
                      <p className="text-sm text-gray-500">{activeDelivery.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-4">
                {activeDelivery.status === "out_for_delivery" ? (
                  <button 
                    onClick={() => handleCompleteDelivery(activeDelivery.id)}
                    disabled={isActionLoading}
                    className="flex-1 bg-emerald-700 text-white font-black py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Confirm Dropoff & Collect Earnings
                  </button>
                ) : (
                  <>
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      Decline
                    </button>
                    <button 
                      onClick={() => handleAcceptOrder(activeDelivery.id)}
                      disabled={isActionLoading}
                      className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Navigation className="w-5 h-5" /> Accept Order
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            isOnline && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">Waiting for delivery requests near you...</p>
              </div>
            )
          )}
        </div>

        {/* Right Column Section: History and Activity Logs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Recent Deliveries</h3>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                Today
              </span>
            </div>

            {recentDeliveries.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentDeliveries.map((delivery: any, idx: number) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors">
                          {delivery.restaurant}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">{delivery.time}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{delivery.payout}</p>
                        <p className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                          Paid
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No delivery activities completed yet today.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── REAL-TIME DISPATCH REQUEST OVERLAY MODAL WINDOW ── */}
      {incomingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative scale-in">
            
            <button 
              onClick={() => setIncomingRequest(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 outline-none p-1 bg-gray-50 rounded-full border border-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100 animate-bounce">
                <BellRing className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  New Order Nearby!
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-2">₦{incomingRequest.payout.toLocaleString()}</h3>
                <p className="text-xs text-gray-400 font-medium">Estimated Trip Earnings</p>
              </div>
            </div>

            <div className="my-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 text-left">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup Origin</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{incomingRequest.restaurantName}</p>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                  <span>📍</span> Proximity: {incomingRequest.distance} from you
                </p>
              </div>
              <div className="border-t border-gray-200/60 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dropoff Destination</p>
                <p className="text-xs font-semibold text-gray-600 mt-0.5">{incomingRequest.dropoffAddress}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIncomingRequest(null)}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold py-3 rounded-xl transition text-sm"
              >
                Decline
              </button>
              <button 
                onClick={async () => {
                  await handleAcceptOrder(`ORD-${incomingRequest.orderId}`);
                  setIncomingRequest(null); 
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-1"
              >
                <Navigation className="w-4 h-4" /> Accept Job
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
