'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Star, Plus, Minus, ShoppingCart, Loader2, Info, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id;
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    const fetchMenu = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/public/restaurants/${businessId}/menu`);
        const data = await res.json();
        
        if (data.success) {
          setRestaurant(data.data.restaurant);
          setMenu(data.data.menu);
        } else {
          setError(data.message || 'Restaurant not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) fetchMenu();
  }, [businessId]);

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.menuItemId === item.id);
    let newCart;
    if (existing) {
      newCart = cart.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
    } else {
      newCart = [...cart, { 
        menuItemId: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        image: item.imageUrl,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name
      }];
    }
    setCart(newCart);
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
  };
  
  const removeFromCart = (itemId: number) => {
    const existing = cart.find(c => c.menuItemId === itemId);
    if (!existing) return;
    
    let newCart;
    if (existing.quantity > 1) {
      newCart = cart.map(c => c.menuItemId === itemId ? { ...c, quantity: c.quantity - 1 } : c);
    } else {
      newCart = cart.filter(c => c.menuItemId !== itemId);
    }
    setCart(newCart);
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
  };

  const getQuantity = (itemId: number) => {
    return cart.find(c => c.menuItemId === itemId)?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#2d5f4f]" /></div>;
  }

  if (error || !restaurant) {
    return (
       <div className="flex flex-col items-center justify-center py-20 text-center">
         <Info className="w-12 h-12 text-gray-300 mb-4" />
         <h1 className="text-xl font-bold text-gray-900 mb-2">{error || 'Restaurant not found'}</h1>
         <Link href="/customer/dashboard"><Button>Back to Dashboard</Button></Link>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Restaurant Header */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-[#2d5f4f] shadow-lg border border-gray-100">
        <img 
          src={restaurant.profilePicUrl || '/categories/jollof.jpg'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Link href="/customer/dashboard" className="w-9 h-9 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-card/40 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-9 h-9 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-red-500 hover:bg-card/40 transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex sm:items-end flex-col sm:flex-row gap-5">
          <div className="text-white flex-1">
             <div className="flex items-center gap-2 mb-1.5">
               <span className="bg-green-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">Open</span>
               <span className="bg-card/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded">{restaurant.type || 'Restaurant'}</span>
             </div>
             <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md mb-2">{restaurant.name}</h1>
             <div className="flex flex-wrap items-center gap-3 text-xs font-bold drop-shadow-sm">
               <div className="flex items-center gap-1 bg-card/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                 <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                 <span>4.8</span>
               </div>
               <div className="flex items-center gap-1 bg-card/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                 <Clock className="w-3.5 h-3.5" />
                 <span>30-45 min</span>
               </div>
               <div className="flex items-center gap-1 bg-card/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                 <MapPin className="w-3.5 h-3.5" />
                 <span>{restaurant.streetAddress || `${restaurant.city}`}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="pt-8">
        <h2 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#2d5f4f]" /> Available Menu
        </h2>
        
        {menu.length === 0 ? (
           <div className="text-center py-10 bg-card rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
             <p className="text-gray-500 font-medium">This restaurant hasn't added any menu items yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {menu.map((item) => (
              <div key={item.id} className="bg-card rounded-3xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#2d5f4f] transition-colors leading-tight mb-1 pr-2">{item.name}</h3>
                    <p className="text-xs font-bold text-[#2d5f4f] mb-1.5 bg-green-50 inline-block px-1.5 py-0.5 rounded">{item.category}</p>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3">
                      {item.description || `Delicious ${item.name} prepared fresh.`}
                    </p>
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow-inner border border-gray-50">
                    <img 
                      src={item.imageUrl || '/categories/jollof.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between mt-2 pt-3 border-t border-gray-50 gap-3">
                  <span className="font-extrabold text-lg text-gray-900">₦{item.price.toLocaleString()}</span>
                  
                  {getQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-inner h-10 w-fit">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-card rounded-lg shadow-sm font-bold text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-extrabold text-sm text-gray-900">{getQuantity(item.id)}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 flex items-center justify-center bg-[#2d5f4f] rounded-lg shadow-sm font-bold text-white hover:bg-[#1a382e] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                       <Button 
                         variant="outline"
                         onClick={() => addToCart(item)}
                         className="rounded-xl px-3 h-10 border-gray-200 hover:bg-gray-50"
                       >
                         <Plus className="w-4 h-4 text-[#2d5f4f]" />
                       </Button>
                       <Button 
                         onClick={() => {
                           addToCart(item);
                           router.push('/customer/dashboard/cart');
                         }}
                         className="rounded-xl px-4 h-10 flex-1 font-bold text-sm bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-sm"
                       >
                         Order Now
                       </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar (still useful to navigate from menu) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 lg:pl-[18rem] z-50 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-[#2d5f4f] rounded-[2rem] p-4 flex items-center justify-between shadow-[0_12px_40px_rgba(45,95,79,0.3)] border border-white/20 backdrop-blur-xl pointer-events-auto">
            <div className="flex items-center gap-3 text-white pl-2">
              <div className="w-10 h-10 bg-card/20 rounded-full flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#2d5f4f]">
                  {cartItemsCount}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-green-200 uppercase tracking-widest">Total</p>
                <p className="font-extrabold text-lg leading-none">₦{cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <Link href="/customer/dashboard/cart">
              <Button className="rounded-2xl px-6 h-12 text-sm font-extrabold bg-card text-[#2d5f4f] hover:bg-gray-100 shadow-md hover:-translate-y-0.5 transition-all">
                Proceed
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
