'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, RefreshCcw, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('customer_token');
      if (!token) return setLoading(false);
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/orders/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data.orders);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    filter === 'all' ? true : 
    filter === 'active' ? (o.status === 'pending' || o.status === 'confirmed') :
    o.status === filter
  );

  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h2>
          <p className="text-gray-500 font-medium mt-1">View and track all your past and active orders.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-[#2d5f4f] text-white hover:bg-[#1e4035]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200'}>All Orders</Button>
           <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')} className={filter === 'active' ? 'bg-orange-500 text-white hover:bg-orange-600 border-none shadow-sm' : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200'}>Active</Button>
           <Button variant={filter === 'delivered' ? 'default' : 'outline'} onClick={() => setFilter('delivered')} className={filter === 'delivered' ? 'bg-green-600 text-white hover:bg-green-700 border-none shadow-sm' : 'text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200'}>Delivered</Button>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center items-center text-gray-400 font-bold gap-3">
            <RefreshCcw className="w-6 h-6 animate-spin" /> Fetching your orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
               <ShoppingBag className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No orders found</h3>
             <p className="text-gray-500 font-medium text-lg">You don't have any orders in this category yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginatedOrders.map(order => (
              <Link key={order.id} href={`/customer/dashboard/orders/${order.id}`} className="block p-5 sm:p-6 hover:bg-gray-50/50 transition-colors group cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-inner group-hover:bg-[#2d5f4f]/5 group-hover:text-[#2d5f4f] transition-colors">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl text-gray-900 group-hover:text-[#2d5f4f] transition-colors">{order.business?.name || 'Restaurant'}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-sm font-semibold text-gray-500 divide-x divide-gray-200">
                      <span className="pr-3">Order {order.id}</span>
                      <span className="pl-3">{format(new Date(order.createdAt), 'MMM dd, yyyy • p')}</span>
                      <span className="pl-3">{order.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className="font-extrabold text-gray-900 text-xl">₦{order.total?.toLocaleString()}</p>
                    <p className={`text-xs font-bold inline-block px-3 py-1 rounded-lg mt-1.5 uppercase tracking-wider
                      ${['pending', 'preparing', 'ready'].includes(order.status) ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-100' : 
                        order.status === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-gray-50 text-gray-600 border border-gray-200'}`}
                    >
                      {order.status === 'out_for_delivery' ? 'on the way' : order.status}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-[#2d5f4f] group-hover:bg-[#2d5f4f]/10 group-hover:translate-x-1 transition-all rounded-full w-12 h-12 shrink-0">
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-100">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-xl font-bold border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Previous
            </Button>
            <span className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="rounded-xl font-bold border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
