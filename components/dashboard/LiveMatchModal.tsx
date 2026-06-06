'use client'

import { X, BellRing, Navigation } from "lucide-react";

interface LiveMatchModalProps {
  incomingRequest: any;
  onClose: () => void;
  onAccept: (id: string) => void;
}

export function LiveMatchModal({ incomingRequest, onClose, onAccept }: LiveMatchModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative scale-in">
        <button 
          onClick={onClose}
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
            <h3 className="text-xl font-black text-gray-900 mt-2">₦{incomingRequest.payout?.toLocaleString()}</h3>
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
            onClick={onClose}
            className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold py-3 rounded-xl transition text-sm"
          >
            Decline
          </button>
          <button 
            onClick={() => {
              onAccept(`ORD-${incomingRequest.orderId}`);
              onClose();
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-1"
          >
            <Navigation className="w-4 h-4" /> Accept Job
          </button>
        </div>
      </div>
    </div>
  );
}
