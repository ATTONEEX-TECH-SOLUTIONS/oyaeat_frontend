'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Heart, TrendingUp, ChevronRight, Menu, ShoppingCart, Loader2, UtensilsCrossed, Leaf, Pizza, CupSoda, Cookie, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 1, name: 'African', icon: Flame, color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Healthy', icon: Leaf, color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Fast Food', icon: Pizza, color: 'bg-red-100 text-red-600' },
  { id: 4, name: 'Drinks', icon: CupSoda, color: 'bg-blue-100 text-blue-600' },
  { id: 5, name: 'Desserts', icon: Cookie, color: 'bg-pink-100 text-pink-600' },
  { id: 6, name: 'Asian', icon: UtensilsCrossed, color: 'bg-purple-100 text-purple-600' },
];

export default function CustomerLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [locationName, setLocationName] = useState('Detecting location...');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Geolocation detector
    useEffect(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state || 'Your Location';
          setLocationName(city);
          
          // REMOVED: if (!searchQuery) setSearchQuery(city); 
          // Do not overwrite the search text box with the city name
        } catch {
          setLocationName('Location found');
        }
      },
      () => setLocationName('Location access denied')
    );
  } else {
    setLocationName('Location not supported');
  }
}, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);


// 2. Updated Fetch Restaurants detector
useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = new URL(`${API_URL}/public/restaurants`);
      url.searchParams.append('limit', '12');
      
      // Send the query only if the user actually typed something
      if (debouncedQuery.trim()) {
        url.searchParams.append('q', debouncedQuery);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.data.restaurants || []); // Fallback array guard
      }
    } catch (e) {
      console.error("Failed to fetch restaurants", e);
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurants();
}, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="w-8 h-8 rounded-full bg-[#2d5f4f] flex items-center justify-center text-white font-bold shadow-md">
                O
              </div> */}
              <span className="text-xl font-bold text-[#2d5f4f] hidden sm:block">oya-eat</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full pl-12 h-11 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/20 rounded-full text-base shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" className="hidden lg:flex text-gray-600 hover:text-[#2d5f4f]">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-extrabold truncate max-w-[150px] tracking-tight">{locationName}</span>
            </Button>
            <Link href="/customer/login">
              <Button variant="outline" className="hidden sm:flex rounded-full border-gray-200 font-semibold hover:bg-gray-50">Log in</Button>
            </Link>
            <Link href="/customer/signup">
              <Button className="rounded-full bg-[#2d5f4f] hover:bg-[#1e4035] text-white shadow-md font-semibold transition-all">Sign up</Button>
            </Link>
            <Link href="/customer/dashboard/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-[#2d5f4f] hover:bg-[#2d5f4f]/10 rounded-full h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food..."
              className="w-full pl-10 h-10 bg-gray-100 border-none focus-visible:ring-[#2d5f4f]/20 rounded-full text-sm"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6 md:py-8 space-y-12">

        {/* Hero Banner Showcase */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2d5f4f] to-[#1a382e] text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-8">
            <div className="flex-1 space-y-5 max-w-xl">
              <span className="inline-block px-4 py-1.5 bg-card/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                Special Offer
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Craving Jollof? <br />
                <span className="text-green-300">We deliver it hot.</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium">
                Get 20% off your first order from selected African restaurants today.
              </p>
              <div className="pt-4">
                <Button className="rounded-full bg-card text-[#2d5f4f] hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  Order Now <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex-shrink-0 mt-6 md:mt-0 items-center justify-center flex">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-[60px] animate-pulse"></div>
              <img
                src="/categories/jollof.jpg"
                alt="Delicious Food"
                className="relative z-10 w-[90%] h-[90%] object-cover rounded-full shadow-2xl border-4 border-white/20 hover:rotate-[5deg] transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 -right-4 bg-card text-gray-900 px-4 py-2 rounded-2xl shadow-xl font-bold flex items-center gap-2 rotate-12 animate-bounce flex-col text-sm border border-gray-100">
                <Flame className="w-6 h-6 text-orange-500" />
                <span>Fresh</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#2d5f4f] text-white px-5 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 -rotate-6 animate-bounce" style={{ animationDelay: '1s' }}>
                <Zap className="w-5 h-5 text-yellow-300" />
                <span>30 Min</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Explore Categories</h2>
            <Button variant="ghost" className="text-[#2d5f4f] hover:bg-[#2d5f4f]/10 font-semibold rounded-full">See all</Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden ${cat.color}`}>
                  <div className="absolute inset-0 bg-card/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <cat.icon className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
                </div>
                <span className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-[#2d5f4f] transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Near You */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              <TrendingUp className="h-7 w-7 text-red-500" />
              Popular Near You
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 text-[#2d5f4f] animate-spin" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              No restaurants currently available. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-card rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-[#2d5f4f]/20 transition-all duration-300 cursor-pointer group flex flex-col h-full ring-1 ring-black/5"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                    <img
                      src={restaurant.thumbnailUrl }
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out relative z-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <button className="absolute top-4 right-4 p-2.5 bg-card/90 backdrop-blur-md rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors duration-200 z-20 group/btn">
                      <Heart className="w-5 h-5 text-gray-400 group-hover/btn:fill-red-500 group-hover/btn:text-red-500 transition-colors" />
                    </button>
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-card/95 backdrop-blur-md rounded-xl shadow-lg text-xs font-bold text-gray-900 z-20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Open Now
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between relative bg-card">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg md:text-xl line-clamp-1 pr-2 group-hover:text-[#2d5f4f] transition-colors">{restaurant.name}</h3>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg text-green-700 text-xs font-bold border border-green-100">
                          <span>4.5</span>
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">{restaurant.type || 'Continental'} • {restaurant.city}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 mt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs mb-0.5">Delivery Fee</span>
                        <span className="text-gray-900 font-bold">₦1000</span>
                      </div>
                      <Link href={`/customer/dashboard/restaurant/${restaurant.id}`} className="text-[#2d5f4f] text-sm font-bold bg-[#2d5f4f]/10 hover:bg-[#2d5f4f]/20 px-4 py-2 rounded-xl transition-colors">
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
