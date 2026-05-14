"use client";

import { useState, useEffect } from "react";
import { 
  Package, MapPin, Calendar, Clock, 
  CheckCircle2, ArrowRight, Eye, AlertCircle 
} from "lucide-react";

export default function RiderDeliveriesList() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDeliveriesHistory = async () => {
      try {
        const token = localStorage.getItem("riderToken");
        const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Reconstruct raw payloads into filter groups
          const allRecent = data.recentDeliveries || [];
          const activeTrip = data.activeDelivery;
          
          // Combine or store them safely
          const formattedList = [...allRecent];
          if (activeTrip) {
            formattedList.unshift({
              id: activeTrip.id,
              restaurant: activeTrip.restaurant,
              payout: activeDeliveryPayoutStringFix(activeTrip.payout),
              status: activeTrip.status,
              time: "Ongoing",
              address: activeTrip.dropoff,
              customer: activeTrip.customer
            });
          }
          setDeliveries(formattedList);
        }
      } catch (err) {
        console.error("Failed loading order logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveriesHistory();
  }, [API_BASE_URL, activeTab]);

  const activeDeliveryPayoutStringFix = (payout: any) => {
    return typeof payout === "string" ? payout : `₦${payout?.toLocaleString()}`;
  };

  // Separate list items based on active click configuration tab state selection
  const filteredItems = deliveries.filter(item => {
    const isItemActive = item.status === "out_for_delivery" || item.time === "Ongoing";
    return activeTab === "active" ? isItemActive : !isItemActive;
  });

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading records...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Structural Toggle Switches */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "active" 
              ? "border-green-600 text-green-600 bg-white" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Assignments ({deliveries.filter(i => i.status === "out_for_delivery" || i.time === "Ongoing").length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "completed" 
              ? "border-green-600 text-green-600 bg-white" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Completed Logs ({deliveries.filter(i => i.status === "delivered" || i.time !== "Ongoing").length})
        </button>
      </div>

      {/* Dynamic List Execution Renderer */}
      <div className="p-6">
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  activeTab === "active" ? "border-green-200 bg-green-50/20" : "border-gray-100 bg-white"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white bg-gray-900 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">{item.restaurant}</h4>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {item.address || "Lagos Metro Delivery"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {item.time === "Ongoing" ? "Picked up · En Route" : `Completed at: ${item.time}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-sm font-black text-gray-900">{item.payout}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block ${
                      activeTab === "active" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                    }`}>
                      {activeTab === "active" ? "In Progress" : "Collected"}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center justify-center gap-2">
            <Package className="w-8 h-8 text-gray-300" />
            <p>No delivery entries found matching this status.</p>
          </div>
        )}
      </div>

    </div>
  );
}
