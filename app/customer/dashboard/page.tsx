'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Clock, MapPin, ChevronRight, TrendingUp, Star, RefreshCcw, ShoppingBag, Heart, Store, ArrowRight, Activity, Zap, Sparkles, Utensils, UtensilsCrossed, Pizza, Leaf, CupSoda } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CUISINES = [
  { id: 'all', name: 'All Cuisines', icon: Utensils },
  { id: 'african', name: 'African', icon: UtensilsCrossed },
  { id: 'fast food', name: 'Fast Food', icon: Pizza },
  { id: 'healthy', name: 'Healthy', icon: Leaf },
  { id: 'drinks', name: 'Drinks', icon: CupSoda },
  { id: 'asian', name: 'Asian', icon: UtensilsCrossed }
];

const PROMOS = [
  { id: 1, title: '20% Off Jollof Fiesta', desc: 'Valid until 5PM today', bg: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { id: 2, title: 'Free Delivery', desc: 'On orders above ₦5,000', bg: 'bg-gradient-to-r from-blue-500 to-teal-500' },
  { id: 3, title: 'New: Bature Brewery', desc: 'Craft beers & grills', bg: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
];

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [frequentItems, setFrequentItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  
  const searchParams = useSearchParams();
  const rawQuery = searchParams?.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePromo, setActivePromo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % PROMOS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('customer_user');
    const token = localStorage.getItem('customer_token');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (token) {
      fetchOrders(token);
    } else {
      setLoadingOrders(false);
    }
  }, []);

  // Update category when rawQuery changes (if it matches a category)
  useEffect(() => {
    if (rawQuery && CUISINES.find(c => c.id === rawQuery.toLowerCase())) {
       setActiveCategory(rawQuery.toLowerCase());
    } else if (!rawQuery) {
       setActiveCategory('all');
    }
  }, [rawQuery]);

  useEffect(() => {
    const q = activeCategory === 'all' ? rawQuery : activeCategory;
    fetchRestaurants(q);
  }, [activeCategory, rawQuery]);

  const fetchOrders = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecentOrders(data.data.orders);
        
        // Extract frequent items for quick reorder
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
        const sortedItems = Array.from(itemsMap.values()).sort((a, b) => b.orderCount - a.orderCount);
        setFrequentItems(sortedItems.slice(0, 4)); // top 4 items
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchRestaurants = async (searchTerm: string) => {
    setLoadingRestaurants(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = new URL(`${API_URL}/public/restaurants`);
      url.searchParams.append('limit', '12');
      if (searchTerm && searchTerm !== 'all') {
        url.searchParams.append('q', searchTerm);
      }
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.data.restaurants);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const activeOrder = recentOrders.find(order => ['pending', 'preparing', 'ready', 'out_for_delivery'].includes(order.status));

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-8">
      
      {/* 1. Header / Welcome & Promos */}
      {!rawQuery && (
        <div className="flex flex-col xl:flex-row gap-6">
           {/* Welcome Tile */}
           <div className="bg-[#2d5f4f] rounded-3xl p-6 sm:p-8 text-white shadow-[0_8px_30px_rgba(45,95,79,0.2)] relative overflow-hidden flex-1 group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000 pointer-events-none"></div>
             <div className="relative z-10 flex flex-col justify-between h-full">
               <div>
                 <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight drop-shadow-md flex items-center gap-3">Welcome back, {user.firstName}! <Sparkles className="w-6 h-6 text-yellow-300" /></h2>
                 <p className="text-green-100 text-sm font-medium leading-relaxed drop-shadow-sm max-w-sm">
                   Hungry? Discover new restaurants or reorder your favorite meals with just a tap.
                 </p>
               </div>
               <div className="mt-8">
                 <Link href="#restaurants">
                    <Button className="rounded-xl px-5 py-5 text-sm font-extrabold bg-white text-[#2d5f4f] hover:bg-gray-100 shadow-xl hover:-translate-y-0.5 transition-all group/btn flex items-center gap-2">
                       Explore Menu <TrendingUp className="h-4 w-4 text-orange-500 group-hover/btn:rotate-12 transition-transform" />
                    </Button>
                 </Link>
               </div>
             </div>
           </div>

           {/* Auto-Rotating Promo Card */}
           <div className="xl:w-[400px] h-[200px] xl:h-[auto] shrink-0 relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group">
              {PROMOS.map((promo, index) => (
                 <div 
                    key={promo.id} 
                    className={`absolute inset-0 w-full h-full ${promo.bg} p-6 flex flex-col justify-between transition-opacity duration-1000 ease-in-out transform ${index === activePromo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                 >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    <div className="relative z-10 text-white">
                      <Zap className="w-8 h-8 xl:w-10 xl:h-10 mb-3 text-yellow-300 drop-shadow-md" />
                      <h3 className="font-extrabold text-xl xl:text-3xl leading-tight mb-2 drop-shadow-md">{promo.title}</h3>
                      <p className="text-white/90 text-sm xl:text-base font-semibold drop-shadow-sm">{promo.desc}</p>
                    </div>
                    {/* Pagination Dots */}
                    <div className="absolute bottom-5 right-6 flex gap-1.5 z-20">
                      {PROMOS.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === activePromo ? 'w-5 bg-white border border-white/20 shadow-sm' : 'w-2 bg-white/40'}`}></div>
                      ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* 2. Active Order Tracker */}
      {activeOrder && !rawQuery && (
         <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2 tracking-tight">
              <Activity className="h-5 w-5 text-orange-500 animate-bounce" />
              Active Order Setup
            </h3>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-gray-900 tracking-tight">{activeOrder.business?.name || 'Restaurant'}</h4>
                  <p className="text-sm font-bold text-gray-500">Order #{activeOrder.id} • <span className="text-[#2d5f4f]">{format(new Date(activeOrder.createdAt), 'p')}</span></p>
                </div>
              </div>
              <div className="flex-1 w-full md:max-w-xs relative h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-[#2d5f4f] rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 text-[8px] text-white font-extrabold"
                  style={{ width: activeOrder.status === 'pending' ? '15%' : activeOrder.status === 'preparing' ? '40%' : activeOrder.status === 'ready' ? '65%' : activeOrder.status === 'out_for_delivery' ? '85%' : '100%' }}
                ></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-orange-50 text-orange-700 px-3 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border border-orange-100">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  {activeOrder.status === 'out_for_delivery' ? 'on the way' : activeOrder.status}
                </span>
                <Link href="/customer/dashboard/orders">
                  <Button variant="outline" className="rounded-xl px-5 font-bold hover:bg-gray-50 text-gray-700 h-10 border-gray-200 shadow-sm">Track</Button>
                </Link>
              </div>
            </div>
         </div>
      )}

      {/* 3. Quick Reorder (Frequent Items) */}
      {!rawQuery && frequentItems.length > 0 && (
         <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              Order it again
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x">
               {frequentItems.map(item => (
                 <Link href={`/customer/dashboard/restaurant/${item.restaurantId}`} key={item.menuItemId} className="snap-start shrink-0 w-[240px] bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover:text-[#2d5f4f] transition-colors mb-1">{item.name}</h4>
                      <p className="text-xs font-semibold text-gray-500 mb-3">{item.restaurantName}</p>
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="font-extrabold text-gray-900 text-lg">₦{item.price.toLocaleString()}</span>
                       <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#2d5f4f]/10 text-gray-400 group-hover:text-[#2d5f4f] flex items-center justify-center transition-colors">
                         <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      )}

      {/* 4. Cuisines / Category Filters */}
      <div className="pt-2 sticky top-20 z-30 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto hide-scrollbar">
         {CUISINES.map(cat => (
           <button
             key={cat.id}
             onClick={() => setActiveCategory(cat.id)}
             className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border ${
                activeCategory === cat.id 
                  ? 'bg-[#2d5f4f] border-[#2d5f4f] text-white' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#2d5f4f]/30 hover:shadow-md'
             }`}
           >
             <cat.icon className="w-4 h-4" />
             {cat.name}
           </button>
         ))}
      </div>

      {/* 5. Restaurants List */}
      <div id="restaurants" className="pt-2 min-h-[400px]">
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
             <Store className="h-6 w-6 text-[#2d5f4f]" />
             {activeCategory !== 'all' 
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Restaurants` 
                : rawQuery ? `Search Results for "${rawQuery}"` : 'All Restaurants Near You'}
           </h3>
         </div>

         {loadingRestaurants ? (
             <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                 <RefreshCcw className="h-8 w-8 text-[#2d5f4f] animate-spin mb-4" />
                 <p className="font-bold text-gray-500">Discovering places...</p>
             </div>
         ) : restaurants.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <Store className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="text-gray-900 font-extrabold text-xl mb-2">No restaurants found</p>
                 <p className="text-gray-500 font-medium max-w-sm mx-auto">Try selecting a different category or searching for something else.</p>
                 <Button onClick={() => setActiveCategory('all')} variant="outline" className="mt-6 rounded-xl font-bold bg-white text-gray-700 shadow-sm">View All</Button>
             </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
              {restaurants.map(rest => (
                <Link key={rest.id} href={`/customer/dashboard/restaurant/${rest.id}`} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={rest.thumbnailUrl || '/categories/jollof.jpg'} 
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
                    />
                     <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-md text-xs font-extrabold text-gray-900 flex items-center gap-1.5 z-10">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open Now
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-gray-50 transition-colors z-10 group/heart">
                      <Heart className="w-4 h-4 text-gray-400 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-colors" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1 relative bg-white">
                    <div>
                       <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-extrabold text-gray-900 text-lg line-clamp-1 pr-2 group-hover:text-[#2d5f4f] transition-colors">{rest.name}</h4>
                          <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-lg text-yellow-700 text-xs font-extrabold border border-yellow-100 tracking-tight">
                            <span>4.8</span><Star className="w-3 h-3 fill-current" />
                          </div>
                       </div>
                       <p className="text-gray-500 text-xs font-bold leading-relaxed">{rest.type || 'Restaurant'} • {rest.city}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-gray-50">
                       <span className="text-gray-600 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100">₦1000 Delivery</span>
                       <span className="text-[#2d5f4f] font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center uppercase tracking-wider text-[10px]">
                         View Menu <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                       </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
         )}
      </div>

    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
