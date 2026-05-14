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
  
  // Simple local cart state
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
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#2d5f4f]" /></div>;
  }

  if (error || !restaurant) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
         <Info className="w-16 h-16 text-gray-300 mb-4" />
         <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Restaurant not found'}</h1>
         <Link href="/customer"><Button>Back to Store</Button></Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 bg-[#2d5f4f]">
        <img 
          src={restaurant.profilePicUrl || '/categories/jollof.jpg'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <Link href="/customer" className="w-10 h-10 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-card/40 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-red-500 hover:bg-card/40 transition-colors cursor-pointer">
            <Heart className="w-5 h-5" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto flex sm:items-end flex-col sm:flex-row gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-2xl bg-card overflow-hidden shrink-0">
             <img src={restaurant.thumbnailUrl || '/categories/jollof.jpg'} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-white flex-1">
             <div className="flex items-center gap-2 mb-2">
               <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Open</span>
               <span className="bg-card/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-md">{restaurant.type || 'Restaurant'}</span>
             </div>
             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md mb-2">{restaurant.name}</h1>
             <p className="text-gray-200 text-sm sm:text-base font-medium max-w-2xl line-clamp-2 drop-shadow-sm mb-4">
               {restaurant.description || `Enjoy the best ${restaurant.type} in ${restaurant.city}. Freshly prepared and delivered piping hot.`}
             </p>
             <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
               <div className="flex items-center gap-1.5 bg-card/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                 <span>4.8 (200+ reviews)</span>
               </div>
               <div className="flex items-center gap-1.5 bg-card/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                 <Clock className="w-4 h-4" />
                 <span>30-45 min</span>
               </div>
               <div className="flex items-center gap-1.5 bg-card/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                 <MapPin className="w-4 h-4" />
                 <span>{restaurant.streetAddress || `${restaurant.city}, ${restaurant.state}`}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-10 py-8 mt-12 sm:mt-4">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Menu Items</h2>
        
        {menu.length === 0 ? (
           <div className="text-center py-12 bg-card rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-gray-500 font-medium">This restaurant hasn't added any menu items yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <div key={item.id} className="bg-card rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-[#2d5f4f] transition-colors leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm font-bold text-[#2d5f4f] mb-2 bg-green-50 inline-block px-2 py-0.5 rounded-md text-xs">{item.category}</p>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4">
                      {item.description || `Delicious ${item.name} prepared with the finest ingredients.`}
                    </p>
                  </div>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow-inner">
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="font-extrabold text-xl text-gray-900">₦{item.price.toLocaleString()}</span>
                  
                  {getQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-inner">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 flex items-center justify-center bg-card rounded-xl shadow-sm font-bold text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-4 text-center font-extrabold text-gray-900">{getQuantity(item.id)}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-10 h-10 flex items-center justify-center bg-[#2d5f4f] rounded-xl shadow-sm font-bold text-white hover:bg-[#1a382e] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                      <Button 
                        variant="outline"
                        onClick={() => addToCart(item)}
                        className="rounded-xl px-4 h-12 font-bold border-gray-200 hover:bg-gray-50"
                      >
                        <Plus className="w-5 h-5 text-[#2d5f4f]" />
                      </Button>
                      <Button 
                        onClick={() => {
                          addToCart(item);
                          router.push('/customer/cart');
                        }}
                        className="rounded-xl px-6 h-12 flex-1 font-extrabold bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto"
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

      {/* Floating Cart Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-50 pointer-events-none animate-in slide-in-from-bottom-10">
          <div className="max-w-4xl mx-auto bg-[#2d5f4f] rounded-[2rem] p-4 sm:p-5 flex items-center justify-between shadow-[0_20px_50px_rgba(45,95,79,0.5)] border border-white/20 backdrop-blur-xl pointer-events-auto">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-card/20 rounded-full flex items-center justify-center relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#2d5f4f]">
                  {cartItemsCount}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-green-200 uppercase tracking-wider">Your Order</p>
                <p className="font-extrabold text-xl">₦{cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <Link href="/customer/cart">
              <Button className="rounded-2xl px-8 py-6 text-lg font-extrabold bg-card text-[#2d5f4f] hover:bg-gray-100 shadow-xl hover:-translate-y-1 transition-all">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
