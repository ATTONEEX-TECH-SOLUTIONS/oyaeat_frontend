'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Banknote, ShieldCheck, Loader2 } from 'lucide-react';
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
    } else {
      router.push('/customer/login');
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
          router.push('/customer/dashboard');
        } else {
          setError(data.message || 'Failed to place order');
        }
      } else {
        // card or transfer -> initialize Paystack
        const res = await fetch(`${API_URL}/orders/initialize-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...orderData,
            email: user.email,
            callbackUrl: window.location.origin + '/customer/dashboard'
          })
        });
        const data = await res.json();
        
        if (data.success && data.data?.authorization_url) {
          localStorage.removeItem('customer_cart');
          window.location.href = data.data.authorization_url; // redirect to paystack
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 px-4 py-4 sm:px-8 flex items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/customer/cart" className="p-2 sm:p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center">
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
          
          {/* Main Checkout Form */}
          <div className="md:col-span-2 space-y-8 pl-1">
            
            {/* Delivery Address */}
            <section className="bg-card rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-[100px] -z-10"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                Delivery Address
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Street Address</label>
                  <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 15 Admiralty Way, Lekki Phase 1" 
                    className="h-14 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-bold text-gray-800 text-base shadow-inner" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Phone Number</label>
                    <Input 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="080 1234 5678" 
                      className="h-14 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-bold text-gray-800 text-base shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Delivery Instructions <span className="text-gray-400 font-medium">(optional)</span></label>
                    <Input 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave at the front door" 
                      className="h-14 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 font-medium text-base shadow-inner" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-card rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-bl-[100px] -z-10"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                Payment Method
              </h2>
              
              <div className="space-y-5">
                {/* Card Option */}
                <label onClick={() => setPaymentMethod('card')} className={`block relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-4 ring-[#2d5f4f]/20 shadow-md transform scale-[1.01]' : 'border-gray-100 hover:border-gray-300 bg-card hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-[#2d5f4f] shadow-sm"></div>}
                    </div>
                    <div className="w-14 h-10 bg-blue-100/50 rounded-xl flex items-center justify-center shrink-0 border border-blue-200/50">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-gray-900 text-lg">Credit / Debit Card</p>
                      <p className="text-sm font-bold text-gray-500 mt-0.5">Pay securely with Paystack</p>
                    </div>
                  </div>
                </label>

                {/* Transfer Option */}
                <label onClick={() => setPaymentMethod('transfer')} className={`block relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === 'transfer' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-4 ring-[#2d5f4f]/20 shadow-md transform scale-[1.01]' : 'border-gray-100 hover:border-gray-300 bg-card hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'transfer' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                      {paymentMethod === 'transfer' && <div className="w-4 h-4 rounded-full bg-[#2d5f4f] shadow-sm"></div>}
                    </div>
                    <div className="w-14 h-10 bg-purple-100/50 rounded-xl flex items-center justify-center shrink-0 border border-purple-200/50">
                      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-purple-600" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-gray-900 text-lg">Bank Transfer</p>
                      <p className="text-sm font-bold text-gray-500 mt-0.5">Transfer directly to our account</p>
                    </div>
                  </div>
                </label>

                {/* Cash Option */}
                <label onClick={() => setPaymentMethod('cash')} className={`block relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === 'cash' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-4 ring-[#2d5f4f]/20 shadow-md transform scale-[1.01]' : 'border-gray-100 hover:border-gray-300 bg-card hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cash' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                      {paymentMethod === 'cash' && <div className="w-4 h-4 rounded-full bg-[#2d5f4f] shadow-sm"></div>}
                    </div>
                    <div className="w-14 h-10 bg-green-100/50 rounded-xl flex items-center justify-center shrink-0 border border-green-200/50">
                      <Banknote className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-gray-900 text-lg">Cash on Delivery</p>
                      <p className="text-sm font-bold text-gray-500 mt-0.5">Pay when your order arrives</p>
                    </div>
                  </div>
                </label>
              </div>
            </section>

          </div>

           {/* Final Summary */}
           <div className="md:col-span-1">
              <div className="bg-[#2d5f4f] rounded-[2.5rem] p-8 border border-[#1e4035] shadow-2xl sticky top-28 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-card/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                <h2 className="text-2xl font-extrabold text-white mb-8 border-b border-white/10 pb-6">Payment Summary</h2>
                
                <div className="flex flex-col mb-10 relative z-10">
                  <span className="font-bold text-green-100 text-sm uppercase tracking-widest mb-2">Total Amount</span>
                  <span className="text-5xl font-extrabold text-white drop-shadow-lg">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-4 relative z-10">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading || cart.length === 0}
                    className="w-full h-16 rounded-2xl text-xl font-extrabold bg-card text-[#2d5f4f] hover:bg-gray-100 shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pay Now'}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-green-100 bg-card/10 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-bold">100% secure & encrypted</span>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </main>
    </div>
  );
}
