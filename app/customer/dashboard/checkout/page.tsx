'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Banknote, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APIProvider } from "@vis.gl/react-google-maps";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash'>('card');
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [address, setAddress] = useState('');
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number } | null>(null);
  
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
    if (!address) {
      setError('A valid delivery dropoff address selection is required.');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('customer_token');
    const businessId = cart[0]?.restaurantId;
    const customerName = `${user?.firstName || 'Customer'} ${user?.lastName || ''}`;

    const orderData = {
      businessId,
      customerName,
      customerPhone: phone,
      address,
      notes,
      items: cart.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      customerLatitude: customerCoords?.lat || null,
      customerLongitude: customerCoords?.lng || null
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
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
            email: user?.email || '',
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

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="w-full bg-gray-50 pb-20 p-4 md:p-8">
        <main className="max-w-5xl mx-auto space-y-6">
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center">
               {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
            
            {/* Main Interactive Forms Column */}
            <div className="md:col-span-2 space-y-8 pl-1">
              
              {/* Delivery Details Card */}
              <section className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" /> Delivery Details
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <AddressAutocomplete 
                      disabled={loading}
                      onAddressSelected={(formattedText, coords) => {
                        setAddress(formattedText);
                        setCustomerCoords(coords);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone</label>
                      <Input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09068603511" 
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 font-bold text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-[#2d5f4f]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Instructions</label>
                      <Input 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Call upon arrival" 
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-[#2d5f4f]" 
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Methods Section */}
              <section className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-700" /> Payment
                </h2>
                
                <div className="space-y-4">
                  <label onClick={() => !loading && setPaymentMethod('card')} className={`block relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-2 ring-[#2d5f4f]/10 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-card hover:bg-gray-50/50'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm">Credit / Debit Card</p>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">Pay securely with Paystack gateway profiles</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </label>

                  <label onClick={() => !loading && setPaymentMethod('transfer')} className={`block relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'transfer' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-2 ring-[#2d5f4f]/10 shadow-sm' : 'border-gray-100 hover:border-gray-300 bg-card hover:bg-gray-50/50'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'transfer' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                        {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm">Bank Transfer</p>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">Transfer directly to our account routing endpoints via Paystack</p>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                    </div>
                  </label>

                  <label onClick={() => !loading && setPaymentMethod('cash')} className={`block relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'cash' ? 'border-[#2d5f4f] bg-[#2d5f4f]/5 ring-2 ring-[#2d5f4f]/10 shadow-sm' : 'border-gray-100 hover:border-gray-300 bg-card hover:bg-gray-50/50'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cash' ? 'border-[#2d5f4f]' : 'border-gray-300'}`}>
                        {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5f4f]"></div>}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <p className="font-extrabold text-gray-900 text-lg">Cash on Delivery</p>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">Pay when your order arrives at your door</p>
                        </div>
                        <Banknote className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

             {/* Right Column Summary Card */}
             <div className="md:col-span-1">
                <div className="bg-[#2d5f4f] rounded-[2rem] p-6 md:p-8 shadow-xl text-white overflow-hidden relative group border border-[#1e4035]">
                  <h2 className="text-xl font-black text-white mb-6 border-b border-white/10 pb-4">Summary</h2>
                  
                  <div className="flex flex-col mb-8">
                    <span className="font-bold text-green-100 text-[10px] uppercase tracking-wider mb-1">Total Amount</span>
                    <span className="text-4xl font-black text-white">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={loading || cart.length === 0}
                      className="w-full h-14 rounded-xl text-md font-extrabold bg-white text-[#2d5f4f] hover:bg-gray-100 shadow-md border-none transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#2d5f4f]" /> : 'Confirm Order'}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-green-100/80 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% encrypted checkout</span>
                    </div>
                  </div>
                </div>
              </div>

          </div>
        </main>
      </div>
    </APIProvider>
  );
}
