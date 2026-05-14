'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, ChefHat, Bike, CheckCircle2, Package, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async (isSilent = false) => {
      const token = localStorage.getItem('customer_token');
      if (!token) return router.push('/customer/login');
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/orders/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const found = data.data.orders.find((o: any) => o.id === Number(orderId));
          setOrder(found);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };
    fetchOrder(false);
    const timer = setInterval(() => fetchOrder(true), 10000);
    return () => clearInterval(timer);
  }, [orderId, router]);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-gray-500">Loading tracking details...</div>;
  if (!order) return <div className="p-20 text-center font-bold text-gray-900">Order not found</div>;

  const statuses = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'ready', label: 'Ready', icon: Package },
    { id: 'out_for_delivery', label: 'On the Way', icon: Bike },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  // Derive current step index based on order.status
  let currentStep = 0;
  if (order.status === 'preparing') currentStep = 1;
  else if (order.status === 'ready') currentStep = 2;
  else if (order.status === 'out_for_delivery') currentStep = 3;
  else if (order.status === 'delivered') currentStep = 4;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-card shadow-sm hover:bg-gray-50">
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tracking Order {order.id}</h2>
          <p className="text-gray-500 font-medium text-sm mt-0.5">{order.business?.name} • {format(new Date(order.createdAt), 'p')}</p>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
         {/* Live Map Mock */}
         <div className="h-48 md:h-64 bg-gray-100 rounded-2xl mb-8 relative overflow-hidden border border-gray-200">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" alt="Map Route" className="w-full h-full object-cover opacity-50 contrast-125 saturate-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent"></div>
            
            {/* Markers */}
            <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-[#2d5f4f] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white z-10">
               <ChefHat className="w-4 h-4" />
            </div>
            
            {currentStep >= 2 && currentStep < 4 && (
               <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-orange-500 text-white rounded-full border-4 border-white shadow-xl flex items-center justify-center z-20 transition-all duration-1000 animate-pulse">
                  <Bike className="w-6 h-6 ml-0.5" />
               </div>
            )}
            
            <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white z-10">
               <MapPin className="w-4 h-4" />
            </div>
            
            {/* Route Line SVG */}
            <svg className="absolute inset-0 w-full h-full text-[#2d5f4f] opacity-40 pointer-events-none" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}>
               <path d="M 25% 25% Q 50% 10% 75% 75%" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
            </svg>
         </div>

         {/* Timeline */}
         <div className="relative mb-8 px-2">
            <div className="absolute top-6 left-8 right-8 h-1.5 bg-gray-100 rounded-full">
               <div className="h-full bg-[#2d5f4f] transition-all duration-1000 ease-out rounded-full" style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}></div>
            </div>
            <div className="relative flex justify-between items-center z-10">
               {statuses.map((s, index) => {
                  const Icon = s.icon;
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                     <div key={s.id} className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border-2 relative bg-card ${isCompleted ? 'border-[#2d5f4f]' : 'border-gray-100'}`}>
                           <Icon className={`w-5 h-5 ${isCompleted ? 'text-[#2d5f4f]' : 'text-gray-300'} ${isCurrent ? 'animate-pulse' : ''}`} />
                           {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#2d5f4f] absolute -bottom-1 -right-1 bg-card rounded-full" />}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* Delivery Info */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Delivery Details</h4>
               <div className="flex bg-gray-50/50 p-4 rounded-2xl gap-4 items-center border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shadow-inner shrink-0">
                     <Bike className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                     <p className="font-extrabold text-sm text-gray-900">John Doe (Rider)</p>
                     <p className="text-xs font-semibold text-gray-500">Honda Courier • KJA-123XD</p>
                  </div>
                  <Button size="icon" variant="outline" className="rounded-full bg-card shadow-sm border-gray-200"><Phone className="w-4 h-4 text-[#2d5f4f]" /></Button>
               </div>
            </div>
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Receipt</h4>
               <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-sm shadow-sm">
                  {order.items?.map((i: any) => (
                    <div key={i.id} className="flex justify-between items-center mb-2 font-semibold text-gray-700">
                      <span className="truncate pr-4">{i.quantity}x {i.menuItem?.name || 'Item'}</span>
                      <span className="font-bold text-gray-900 shrink-0">₦{((i.price || 0) * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-gray-200 mt-3 pt-3 flex justify-between items-center font-extrabold text-lg text-[#2d5f4f]">
                    <span>Total Paid</span>
                    <span>₦{(order.total || 0).toLocaleString()}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
