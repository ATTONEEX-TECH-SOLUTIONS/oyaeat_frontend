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

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [frequentItems, setFrequentItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [likedRestaurants, setLikedRestaurants] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  // ── Dynamic Promotional Campaign States ──
  const [promos, setPromos] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState(0);

  const searchParams = useSearchParams();
  const rawQuery = searchParams?.get('q') || '';
  const [activeCategory, setActiveCategory] = useState('all');

  // Auto-rotating timer scaled securely against dynamic array size
  useEffect(() => {
    if (promos.length === 0) return;
    const timer = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promos.length]);

  useEffect(() => {
    const userData = localStorage.getItem('customer_user');
    const token = localStorage.getItem('customer_token');

    if (userData) {
      setUser(JSON.parse(userData));
    }

    try {
      const storedLikes = localStorage.getItem('liked_restaurants');
      if (storedLikes) setLikedRestaurants(JSON.parse(storedLikes));
    } catch { }

    if (token) {
      fetchOrders(token);
    } else {
      setLoadingOrders(false);
    }

    // Trigger promotional data synchronization on page mount
    fetchLivePromos();
  }, []);

  const fetchLivePromos = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // 🚀 FIXED: URL adjusted to target /public/promos/public-feed match rules
    const res = await fetch(`${API_URL}/public/promos/public-feed`);
    const json = await res.json();
    
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      setPromos(json.data);
    } else {
      // High-fidelity fallback defaults if database collections are currently empty
      setPromos([
        { id: 'f1', title: 'Welcome to OyaEat!', desc: 'Explore delicious meals near you', bgGradient: 'from-[#2d5f4f] to-slate-800' },
        { id: 'f2', title: 'Free Delivery Weekend', desc: 'On orders above ₦5,000 totals', bgGradient: 'from-blue-500 to-teal-500' }
      ]);
    }
  } catch (err) {
    console.error("Failed to sync promo deck metrics:", err);
    setPromos([
      { id: 'f1', title: 'Fresh Food, Fast Delivery', desc: 'Browse trending restaurants below', bgGradient: 'from-orange-500 to-red-500' }
    ]);
  }
};


  const toggleLike = (e: React.MouseEvent, restaurant: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('liked_restaurants');
      let currentLikes = stored ? JSON.parse(stored) : [];
      let newLikes;
      if (currentLikes.some((r: any) => r.id === restaurant.id)) {
        newLikes = currentLikes.filter((r: any) => r.id !== restaurant.id);
      } else {
        newLikes = [...currentLikes, restaurant];
      }
      localStorage.setItem('liked_restaurants', JSON.stringify(newLikes));
      setLikedRestaurants(newLikes);
    } catch (e) { }
  };

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
        setFrequentItems(sortedItems.slice(0, 4));
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
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-8">

      {/* 1. Header / Welcome & Dynamic Promotional Carousel */}
      {!rawQuery && (
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Welcome Tile */}
          <div className="bg-[#2d5f4f] rounded-3xl p-6 sm:p-8 text-white shadow-[0_8px_30px_rgba(45,95,79,0.2)] relative overflow-hidden flex-1 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000 pointer-events-none"></div>
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

          {/* ACTIVE MARKETING CAMPAIGN ROTATING CAROUSEL CARD */}
                   
          {promos.length > 0 && (
            <div className="w-full xl:w-[420px] h-[210px] relative overflow-hidden rounded-3xl shadow-lg group">
              {promos.map((promo, idx) => {
                const isUploadedImage = promo.bgGradient?.startsWith('http://') || promo.bgGradient?.startsWith('https://');
                // Safely grab the restaurant name from the relational business object path
                const restaurantName = promo.business?.name || "OyaEat Partner";

                return (
                  <div
                    key={promo.id || idx}
                    className={`absolute inset-0 w-full h-full p-6 flex flex-col justify-between transition-all duration-700 ease-in-out bg-cover bg-center ${
                      idx === activePromo ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-8 scale-95 z-0 pointer-events-none'
                    } ${!isUploadedImage ? `bg-gradient-to-r ${promo.bgGradient || 'from-slate-700 to-slate-900'}` : ''}`}
                    style={isUploadedImage ? { backgroundImage: `url(${promo.bgGradient})` } : {}}
                  >
                    {/* Dark gradient overlay for text readability over custom background images */}
                    {isUploadedImage && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-0" />}

                    {/* Top Content Row */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white inline-flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300 animate-pulse" /> Platform Promo
                        </span>
                        
                        {/* 🌟 NEW UX ELEVATION: High-visibility restaurant name badge */}
                        <span className="bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-bold text-orange-300 inline-flex items-center gap-1 max-w-[150px] truncate">
                          <Store className="w-3 h-3 text-orange-400 flex-shrink-0" /> {restaurantName}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black tracking-tight text-white drop-shadow-md pr-10 line-clamp-2 leading-tight">{promo.title}</h3>
                      <p className="text-xs font-semibold text-white/80 mt-1 line-clamp-2 drop-shadow-sm max-w-[300px]">{promo.desc}</p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="relative z-10 flex justify-between items-end mt-4">
                      {promo.businessId ? (
                        <Link href={`/restaurant/${promo.businessId}`}>
                          <Button className="rounded-xl h-8 px-4 text-[11px] font-extrabold bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5 group/btn">
                            Order Now <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                      ) : (
                        <div className="h-8" /> /* Layout spacer matching baseline dimensions */
                      )}
                      
                      {/* Carousel Indicator Progress Dots */}
                      <div className="flex gap-1.5 mb-1.5">
                        {promos.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === activePromo ? 'w-4 bg-orange-400' : 'w-1.5 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-[#2d5f4f] rounded-full transition-all duration-1000 ease-out"
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
            {frequentItems.map(item => {
              const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
              const menuItemImg = item.menuItem?.imageUrl || item.imageUrl || item.image;
              const finalMenuItemImgUrl = menuItemImg
                ? (menuItemImg.startsWith('http') ? menuItemImg : `${API_URL}${menuItemImg}`)
                : 'https://unsplash.com';

              return (
                <Link href={`/customer/dashboard/restaurant/${item.restaurantId}`} key={item.menuItemId} className="snap-start shrink-0 w-[240px] bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all group flex flex-col justify-between">
                  <div className="h-32 w-full bg-gray-100 overflow-hidden relative">
                    <img
                      src={finalMenuItemImgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white relative -mt-1 rounded-t-2xl">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover:text-[#2d5f4f] transition-colors mb-1">{item.name}</h4>
                      <p className="text-xs font-semibold text-gray-500 mb-2">{item.restaurantName}</p>
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <span className="font-extrabold text-gray-900 text-lg">₦{item.price ? item.price.toLocaleString() : '0'}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#2d5f4f]/10 text-gray-400 group-hover:text-[#2d5f4f] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Cuisines / Category Filters */}
      <div className="pt-2 sticky top-20 z-30 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto hide-scrollbar">
        {CUISINES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border ${activeCategory === cat.id
                ? 'bg-[#2d5f4f] border-[#2d5f4f] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#2d5f4f]/30 hover:shadow-md'
              }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* 5. Restaurants List Section */}
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
            {restaurants.map((rest: any) => {
              const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
              const gallery = rest.galleryImages || [];

              // Unpack and secure real Cloudinary asset links from your new gallery relationship
              const firstGalleryItem = gallery[0]?.imageUrl || '';
              const mainBanner = firstGalleryItem.startsWith('http') 
                ? firstGalleryItem 
                : `${API_BASE_URL}${firstGalleryItem}`;

              const subUrlOne = gallery[1]?.imageUrl || '';
              const subPreviewOne = subUrlOne.startsWith('http') 
                ? subUrlOne 
                : `${API_BASE_URL}${subUrlOne}`;

              const subUrlTwo = gallery[2]?.imageUrl || '';
              const subPreviewTwo = subUrlTwo.startsWith('http') 
                ? subUrlTwo 
                : `${API_BASE_URL}${subUrlTwo}`;

              return (
                <Link key={rest.id} href={`/customer/dashboard/restaurant/${rest.id}`} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-[200px] bg-white p-1">
                    <div className="flex gap-1 h-full w-full">
                      
                      {/* Left Block: Main Banner View */}
                      <div className={`h-full relative overflow-hidden rounded-tl-[1.8rem] rounded-bl-xl transition-all ${gallery.length > 1 ? 'w-2/3' : 'w-full rounded-tr-[1.8rem] rounded-br-xl'}`}>
                        {firstGalleryItem ? (
                          <img
                            src={mainBanner}
                            alt={rest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
                            No Banner Added
                          </div>
                        )}
                        <div className="absolute top-2 left-2 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-md text-[10px] sm:text-xs font-extrabold text-gray-900 flex items-center gap-1.5 z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Open
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Right Block: Dynamic Side Previews */}
                      {gallery.length > 1 && (
                        <div className="w-1/3 flex flex-col gap-1 h-full">
                          <div className="h-1/2 w-full relative overflow-hidden rounded-tr-[1.8rem] rounded-br-md">
                            {subUrlOne ? (
                              <img
                                src={subPreviewOne}
                                alt="Showcase layout 2"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out delay-75"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50" />
                            )}
                            <div 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleLike(e, rest);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-gray-50 transition-colors z-10 cursor-pointer group/heart"
                            >
                              <Heart className={`w-3.5 h-3.5 transition-colors ${likedRestaurants.some((r: any) => r.id === rest.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-500 group-hover/heart:fill-red-500'}`} />
                            </div>
                          </div>
                          <div className="h-1/2 w-full relative overflow-hidden rounded-br-xl rounded-tr-md">
                            {subUrlTwo ? (
                              <img
                                src={subPreviewTwo}
                                alt="Showcase layout 3"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out delay-150"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
                      <span className="text-gray-600 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        Min. ₦{(rest.minimumOrder || 0).toLocaleString()}
                      </span>
                      <span className="text-[#2d5f4f] font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center uppercase tracking-wider text-[10px]">
                        View Menu <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-bold bg-gray-50">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
