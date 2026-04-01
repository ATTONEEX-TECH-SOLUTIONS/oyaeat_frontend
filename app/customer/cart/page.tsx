'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = items.length > 0 ? 1000 : 0;
  const serviceFee = items.length > 0 ? 250 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const updateQuantity = (id: number, delta: number) => {
    const newCart = items.map(item => {
      if (item.menuItemId === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    });
    setItems(newCart);
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = items.filter(item => item.menuItemId !== id);
    setItems(newCart);
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
  };
  
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('customer_cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 px-4 py-4 sm:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/customer" className="p-2 sm:p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
        </div>
        <div className="text-sm font-bold text-gray-500 bg-white shadow-sm px-4 py-2 rounded-full border border-gray-100">
          <span className="text-[#2d5f4f] text-base mr-1">{items.length}</span> items
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                   <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                     <ShoppingBag className="w-7 h-7 text-[#2d5f4f]" /> Cart Items
                   </h2>
                   <button 
                     onClick={clearCart}
                     className="text-sm font-bold text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-full transition-colors"
                   >
                     Clear all
                   </button>
                </div>

                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                      <div className="w-full sm:w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-gray-100 shadow-sm border border-gray-50 relative">
                        <img 
                          src={item.image || '/categories/jollof.jpg'} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      </div>
                      
                      <div className="flex-1 w-full relative sm:pr-12 py-2">
                        <h3 className="font-extrabold text-xl text-gray-900 leading-tight mb-2 pr-8 sm:pr-0 group-hover:text-[#2d5f4f] transition-colors">{item.name}</h3>
                        <p className="text-sm font-bold text-gray-500 mb-5">{item.restaurantName}</p>
                        
                        <div className="flex flex-wrap items-center justify-between w-full gap-4">
                          <p className="font-extrabold text-2xl text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                          
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 shadow-inner">
                            <button 
                              onClick={() => updateQuantity(item.menuItemId, -1)}
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-all border border-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-extrabold text-xl text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.menuItemId, 1)}
                              className="w-10 h-10 flex items-center justify-center bg-[#2d5f4f] rounded-xl shadow-sm font-bold text-white hover:bg-[#1a382e] transition-all hover:scale-105"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeItem(item.menuItemId)}
                          className="absolute top-2 right-0 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl sticky top-28 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] before:opacity-[0.03] before:rounded-[2.5rem]">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#2d5f4f]">
                    <Receipt className="w-5 h-5" />
                  </div>
                  Order Summary
                </h2>
                
                <div className="space-y-5 mb-8 relative z-10">
                  <div className="flex justify-between items-center text-gray-600 font-bold pb-4 border-b border-dashed border-gray-200 text-lg">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-gray-900">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-bold">
                    <span>Delivery Fee</span>
                    <span className="font-extrabold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-bold">
                    <span>Service Fee</span>
                    <span className="font-extrabold text-gray-900">₦{serviceFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col mb-8 bg-[#2d5f4f]/5 p-6 rounded-3xl border border-[#2d5f4f]/10 relative z-10">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-1">Total Payment</span>
                  <span className="text-4xl font-extrabold text-[#2d5f4f]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <Link href="/customer/checkout" className="block relative z-10">
                  <Button className="w-full h-16 rounded-2xl text-xl font-extrabold bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-[0_8px_30px_rgb(45,95,79,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(45,95,79,0.4)] group flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
                
                <p className="text-center text-sm font-bold text-gray-400 mt-6 relative z-10">
                  Secure checkout powered by OyaEat
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-24 sm:py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm max-w-3xl mx-auto flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-40 h-40 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100 animate-bounce">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
              <p className="text-gray-500 font-bold mb-10 text-lg max-w-md mx-auto leading-relaxed">
                Looks like you haven't added any delicious meals yet. Explore our top restaurants and satisfy your cravings!
              </p>
              <Link href="/customer">
                <Button className="h-16 px-12 rounded-[2rem] text-xl font-extrabold bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-[0_8px_30px_rgb(45,95,79,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(45,95,79,0.4)]">
                  Start Ordering Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
