'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.emailOrPhone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/customer/auth/login`, {
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
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side: Image Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2d5f4f]">
        <div className="absolute inset-0 bg-black/30 z-10 transition-opacity duration-700 hover:opacity-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Delicious food" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
          <Link href="/customer" className="flex items-center gap-2 group w-fit backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10 hover:bg-black/40 transition-colors">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wide">Back to Home</span>
          </Link>
          
          <div className="max-w-md space-y-6 slide-up-animation">
            <div className="w-14 h-14 rounded-2xl bg-card/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold shadow-2xl border border-white/20">
              O
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              The fastest food delivery in your city.
            </h1>
            <p className="text-xl text-gray-100 drop-shadow-md font-medium">
              Join thousands of food lovers and get your favorite meals delivered blazing fast.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative bg-card">
        <Link href="/customer" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 group bg-gray-50 px-3 py-2 rounded-full shadow-sm">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back</span>
        </Link>
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-3 text-gray-500 font-medium text-lg">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2 group/input">
                <label className="text-sm font-bold text-gray-900">Email Address or Phone</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                  <Input 
                    type="text" 
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="Enter your email or phone" 
                    className="pl-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-card shadow-inner border-gray-100 text-base transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 group/input">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Password</label>
                  <Link href="#" className="text-sm font-bold text-[#2d5f4f] hover:text-[#1e4035] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="pl-12 pr-12 h-14 rounded-2xl bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/30 focus-visible:bg-card shadow-inner border-gray-100 text-base transition-all"
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
            </div>

            <Button disabled={loading} type="submit" className="w-full h-14 text-lg font-extrabold rounded-2xl bg-[#2d5f4f] hover:bg-[#1a382e] text-white shadow-[0_8px_30px_rgb(45,95,79,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(45,95,79,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_30px_rgb(45,95,79,0.3)]">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </Button>

            <div className="relative text-center mx-4 py-2">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-100"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-4 bg-card text-gray-400 font-bold uppercase tracking-wider text-xs">Or continue with</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="h-14 bg-card border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-2xl font-bold shadow-sm transition-all group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Google
              </Button>
              <Button variant="outline" type="button" className="h-14 bg-card border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-2xl font-bold shadow-sm text-[#1877F2] transition-all group">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Facebook
              </Button>
            </div>
          </form>

          <p className="text-center text-gray-600 text-base font-medium pt-4">
            Don't have an account?{' '}
            <Link href="/customer/signup" className="text-[#2d5f4f] font-extrabold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
