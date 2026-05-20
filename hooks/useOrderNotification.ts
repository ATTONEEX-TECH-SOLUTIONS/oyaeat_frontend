"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface IncomingOrderAlert {
  orderId: number;
  restaurantName: string;
  payout: number;
  distance: string;
  dropoffAddress: string;
}

export function useOrderNotification(isOnline: boolean, onNewOrderReceived: (order: IncomingOrderAlert) => void) {
  useEffect(() => {
    if (!isOnline) return;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = localStorage.getItem("riderToken");

    if (!token) return;

    // Connect to the backend socket instance securely
    const socket: Socket = io(API_BASE_URL, {
      auth: { token } // Transmits the JWT signature to our init.js auth middleware block
    });

    // Handle authentication or socket connection drops gracefully
    socket.on("connect_error", (err) => {
      console.error("WebSocket handshaking rejected:", err.message);
    });

    // Listen for the instant order matching signal from our Express Orders Controller
    socket.on("NEW_DELIVERY_REQUEST", (orderData: IncomingOrderAlert) => {
      console.log("🎯 Live incoming delivery match event caught via socket:", orderData);
      onNewOrderReceived(orderData); // Triggers our visual layout state updates
    });

    // Destructor hook teardown cleanup: close stream connection when rider goes offline
    return () => {
      socket.disconnect();
    };
  }, [isOnline]);
}
