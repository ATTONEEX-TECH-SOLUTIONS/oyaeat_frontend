'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomerSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/customer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token to localStorage
        localStorage.setItem('customer_token', data.data.token);
        localStorage.setItem('customer_user', JSON.stringify(data.data.user));
        
        // Redirect to dashboard
        router.push('/customer/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right side: Image Showcase */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-orange-50 order-2">
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 hover:opacity-20"></div>
        <img 
          src="https://images.unsplash.com/photo-1490818387583-1b98e228556f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Fresh ingredients" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[15s]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white items-end text-right">
          <Link href="/customer" className="flex items-center gap-2 group w-fit backdrop-blur-md bg-black/20 px-5 py-2.5 rounded-full border border-white/10 hover:bg-black/40 transition-all font-semibold shadow-xl">
            <span>Skip for now</span>
            <ArrowLeft className="h-5 w-5 group-hover:translate-x-1 transition-transform rotate-180" />
          </Link>
          
          <div className="max-w-md space-y-6 flex flex-col items-end animate-in slide-in-from-right-8 duration-700">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-extrabold shadow-2xl border border-white/20">
              O
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-2xl">
              Deliciousness is just a click away.
            </h1>
            <p className="text-xl text-gray-100 font-medium drop-shadow-md leading-relaxed">
              Create an account to track your orders, save your favorite spots, and get exclusive offers.
            </p>
          </div>
        </div>
      </div>

      {/* Left side: Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-28 relative order-1 bg-white overflow-y-auto min-h-screen">
        <Link href="/customer" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 group bg-gray-50 px-3 py-2 rounded-full shadow-sm z-50">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back</span>
        </Link>
        
        <div className="w-full max-w-md mx-auto space-y-8 py-12 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
            <p className="mt-3 text-gray-500 font-medium text-lg">Join OyaEat to start ordering today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                  <Input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John" 
                    className="pl-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-white shadow-inner border-gray-100 text-base transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                  <Input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe" 
                    className="pl-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-white shadow-inner border-gray-100 text-base transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  className="pl-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-white shadow-inner border-gray-100 text-base transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                <Input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="080 1234 5678" 
                  className="pl-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-white shadow-inner border-gray-100 text-base transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password" 
                  className="pl-12 pr-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-white shadow-inner border-gray-100 text-base transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button disabled={loading} type="submit" className="w-full h-14 text-lg font-extrabold rounded-2xl bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-[0_8px_30px_rgb(45,95,79,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(45,95,79,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_30px_rgb(45,95,79,0.3)]">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6 font-medium leading-relaxed">
              By signing up, you agree to our{' '}
              <Link href="#" className="font-bold text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors">Terms of Service</Link> 
              {' '}and{' '} 
              <Link href="#" className="font-bold text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors">Privacy Policy</Link>.
            </p>
          </form>

          <div className="flex items-center justify-center pt-4 border-t border-gray-100 mt-8">
            <p className="text-center text-gray-600 text-base font-medium">
              Already have an account?{' '}
              <Link href="/customer/login" className="text-[#2d5f4f] font-extrabold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
