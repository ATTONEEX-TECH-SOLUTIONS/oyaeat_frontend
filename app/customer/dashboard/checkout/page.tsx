'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Banknote, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash'>('card');
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    const savedUser = localStorage.getItem('customer_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setPhone(u.phone || '');
      } catch (e) {}
    }
  }, [router]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 1000 : 0;
  const serviceFee = cart.length > 0 ? 250 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError('');

    const token = localStorage.getItem('customer_token');
    const businessId = cart[0].restaurantId;
    const customerName = `${user.firstName} ${user.lastName}`;

    const orderData = {
      businessId,
      customerName,
      customerPhone: phone,
      address,
      notes,
      items: cart.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      if (paymentMethod === 'cash') {
        const res = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...orderData, paymentMethod: 'cash' })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.removeItem('customer_cart');
          router.push('/customer/dashboard/orders');
        } else {
          setError(data.message || 'Failed to place order');
        }
      } else {
        const res = await fetch(`${API_URL}/orders/initialize-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...orderData,
            email: user.email,
            callbackUrl: window.location.origin + '/customer/dashboard/orders'
          })
        });
        const data = await res.json();
        
        if (data.success && data.data?.authorization_url) {
          localStorage.removeItem('customer_cart');
          window.location.href = data.data.authorization_url;
        } else {
          setError(data.message || 'Failed to initialize payment gateway');
        }
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) return (
     <div className="flex flex-col justify-center items-center py-20 animate-pulse text-gray-500 font-bold">
        Loading checkout...
     </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center shadow-sm">
           {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        
        {/* Main Checkout Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Delivery Address */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              Delivery Details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] uppercase tracking-wider font-extrabold text-gray-500">Street Address</label>
                <Input 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 15 Admiralty Way, Lekki Phase 1" 
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-bold text-gray-800 text-sm shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] uppercase tracking-wider font-extrabold text-gray-500">Phone</label>
                  <Input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080 1234 5678" 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-bold text-gray-800 text-sm shadow-inner" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] uppercase tracking-wider font-extrabold text-gray-500">Instructions</label>
                  <Input 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival" 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-medium text-sm shadow-inner" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              Payment
            </h2>
            
            <div className="space-y-4">
              <label onClick={() => setPaymentMethod('card')} className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-900 text-sm">Credit / Debit Card</p>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
              </label>

              <label onClick={() => setPaymentMethod('transfer')} className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${paymentMethod === 'transfer' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'transfer' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                    {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-900 text-sm">Bank Transfer</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </label>

              <label onClick={() => setPaymentMethod('cash')} className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${paymentMethod === 'cash' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cash' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-900 text-sm">Cash on Delivery</p>
                  </div>
                  <Banknote className="w-5 h-5 text-gray-400" />
                </div>
              </label>
            </div>
          </section>

        </div>

         {/* Final Summary */}
         <div className="md:col-span-1">
            <div className="bg-[#2d5f4f] rounded-3xl p-6 border border-[#1e4035] shadow-xl sticky top-28 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light text-white overflow-hidden relative">
              <h2 className="text-xl font-extrabold text-white mb-6 border-b border-white/10 pb-4 tracking-tight">Summary</h2>
              
              <div className="flex flex-col mb-8 relative z-10">
                <span className="font-bold text-green-100 text-xs uppercase tracking-widest mb-1.5">Total Amount</span>
                <span className="text-4xl font-extrabold text-white drop-shadow-md">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.length === 0}
                  className="w-full h-14 rounded-xl text-lg font-extrabold bg-white text-[#2d5f4f] hover:bg-gray-100 shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order'}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-green-100/90 bg-white/5 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">100% Encrypted</span>
                </div>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
}
