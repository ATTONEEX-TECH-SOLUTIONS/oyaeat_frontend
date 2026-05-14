'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Receipt, ShoppingCart } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h2>
          <p className="text-gray-500 font-medium mt-1">Review your items before proceeding to payment.</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-sm font-bold text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-full transition-colors border border-red-100"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                    <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow-sm border border-gray-50 relative">
                      <img 
                        src={item.image || '/categories/jollof.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 w-full relative sm:pr-12">
                      <h3 className="font-extrabold text-lg text-gray-900 leading-tight mb-1 pr-8 sm:pr-0 group-hover:text-[#2d5f4f] transition-colors">{item.name}</h3>
                      <p className="text-xs font-bold text-gray-500 mb-4">{item.restaurantName}</p>
                      
                      <div className="flex flex-wrap items-center justify-between w-full gap-4">
                        <p className="font-extrabold text-xl text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                        
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-[1rem] p-1 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-card rounded-xl shadow-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-all border border-gray-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-extrabold text-lg text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#2d5f4f] rounded-xl shadow-sm font-bold text-white hover:bg-[#1a382e] transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(item.menuItemId)}
                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-xl sticky top-28 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] before:opacity-[0.03] before:rounded-[2rem]">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#2d5f4f]">
                  <Receipt className="w-5 h-5" />
                </div>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 relative z-10 text-sm">
                <div className="flex justify-between items-center text-gray-600 font-bold pb-4 border-b border-dashed border-gray-200">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-gray-900 text-base">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-bold">
                  <span>Delivery Fee</span>
                  <span className="font-extrabold text-gray-900 text-base">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-bold">
                  <span>Service Fee</span>
                  <span className="font-extrabold text-gray-900 text-base">₦{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 bg-[#2d5f4f]/5 p-5 rounded-2xl border border-[#2d5f4f]/10 relative z-10">
                <span className="font-extrabold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#2d5f4f]">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <Link href="/customer/dashboard/checkout" className="block relative z-10">
                <Button className="w-full h-14 rounded-xl text-lg font-extrabold bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Checkout Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-gray-100">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
          <p className="text-gray-500 font-bold mb-8 text-base max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added any delicious meals yet. Start exploring restaurants.
          </p>
          <Link href="/customer/dashboard">
            <Button className="h-14 px-10 rounded-xl text-lg font-extrabold bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-md transition-all hover:-translate-y-0.5">
              Browse Menu
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
