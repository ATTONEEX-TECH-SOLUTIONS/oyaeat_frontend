'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Star, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerFavoritesPage() {
  const [frequentItems, setFrequentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderedItems = async () => {
      const token = localStorage.getItem('customer_token');
      if (!token) return setLoading(false);
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/orders/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          // Extract and deduplicate items
          const itemsMap = new Map();
          
          data.data.orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
              if (!itemsMap.has(item.menuItemId)) {
                itemsMap.set(item.menuItemId, {
                   ...item,
                   restaurantName: order.business?.name || 'Restaurant',
                   restaurantId: order.businessId,
                   orderCount: 1
                });
              } else {
                const existing = itemsMap.get(item.menuItemId);
                existing.orderCount += 1;
                itemsMap.set(item.menuItemId, existing);
              }
            });
          });
          
          // Sort by orderCount descending
          const sortedItems = Array.from(itemsMap.values()).sort((a, b) => b.orderCount - a.orderCount);
          setFrequentItems(sortedItems.slice(0, 12)); // top 12
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderedItems();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Favorites</h2>
          <p className="text-gray-500 font-medium mt-1">Meals you frequently order. Quick and easy checkout.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400 font-bold gap-3 animate-pulse">
             Fetching your favorite meals...
          </div>
        ) : frequentItems.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
               <Heart className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No favorites yet</h3>
             <p className="text-gray-500 font-medium text-lg max-w-sm">Order some delicious meals from the store and they will appear here!</p>
             <Link href="/customer" className="mt-8">
               <Button className="rounded-2xl px-8 h-12 font-bold bg-[#2d5f4f] text-white">Browse Restaurants</Button>
             </Link>
          </div>
        ) : (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frequentItems.map((item) => (
              <div key={item.menuItemId} className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="bg-[#2d5f4f]/10 text-[#2d5f4f] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2d5f4f]/20">
                      Ordered {item.orderCount}x
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-900 leading-tight mb-1 group-hover:text-[#2d5f4f] transition-colors line-clamp-2">{item.name}</h3>
                  <p className="text-sm font-semibold text-gray-500 mb-4">{item.restaurantName}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                  <span className="font-extrabold text-xl text-gray-900 flex-1">₦{item.price?.toLocaleString()}</span>
                  
                  <Link href={`/customer/restaurant/${item.restaurantId}`}>
                    <Button className="rounded-xl px-5 h-10 font-extrabold bg-white text-[#2d5f4f] border border-gray-200 hover:border-[#2d5f4f] hover:bg-gray-50 transition-all shadow-sm">
                      Order Again
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dummy imported to fix broken missing icon, we aren't using normal heart here.
// Let's bring Heart from lucide
import { Heart } from 'lucide-react';
