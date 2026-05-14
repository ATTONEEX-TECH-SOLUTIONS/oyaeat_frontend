'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, Save, Loader2, CreditCard, Bell, Leaf, Gift, Shield, Copy, CheckCircle2, Facebook, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomerSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('customer_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const currentTabClass = "bg-[#2d5f4f] text-white shadow-md font-bold";
  const idleTabClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-semibold";

  if (!user) return null;

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h2>
        <p className="text-gray-500 font-medium text-sm mt-1">Manage your profile, dietary needs, and app preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-card rounded-[1.5rem] border border-gray-100 shadow-sm p-3 flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'profile' ? currentTabClass : idleTabClass}`}
            >
               <User className="w-4 h-4" /> Personal Info
            </button>
            <button 
              onClick={() => setActiveTab('dietary')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'dietary' ? currentTabClass : idleTabClass}`}
            >
               <Leaf className="w-4 h-4" /> Dietary & Allergies
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'address' ? currentTabClass : idleTabClass}`}
            >
               <MapPin className="w-4 h-4" /> Address Book
            </button>
            <button 
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'payments' ? currentTabClass : idleTabClass}`}
            >
               <CreditCard className="w-4 h-4" /> Payment Methods
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'notifications' ? currentTabClass : idleTabClass}`}
            >
               <Bell className="w-4 h-4" /> Notifications
            </button>
            <div className="border-t border-gray-100 my-2"></div>
            <button 
              onClick={() => setActiveTab('referrals')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'referrals' ? currentTabClass : idleTabClass}`}
            >
               <Gift className="w-4 h-4" /> Refer a Friend
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm text-left ${activeTab === 'privacy' ? currentTabClass : idleTabClass}`}
            >
               <Shield className="w-4 h-4" /> Privacy & Data
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-card rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
            
            {activeTab === 'profile' && (
               <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-50 pb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                        <Input defaultValue={user.firstName} className="h-11 rounded-xl bg-gray-50/50 font-bold border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                        <Input defaultValue={user.lastName} className="h-11 rounded-xl bg-gray-50/50 font-bold border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input defaultValue={user.email} disabled className="pl-10 h-11 rounded-xl bg-gray-100 text-gray-500 font-medium border-gray-100" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input defaultValue={user.phone} className="pl-10 h-11 rounded-xl bg-gray-50/50 font-bold border-gray-200" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                      <Button onClick={handleSave} disabled={loading} className="h-11 rounded-xl px-8 text-sm font-bold bg-[#2d5f4f] hover:bg-[#1a382e] text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 p-6 sm:p-8 bg-gray-50/30">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#2d5f4f]" /> Connected Accounts & Security
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100"><Lock className="w-5 h-5 text-gray-500" /></div>
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-900">Password</h4>
                                    <p className="text-xs text-gray-500 font-medium">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg font-bold">Update</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100"><Facebook className="w-5 h-5 text-blue-600 fill-blue-600" /></div>
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-900">Facebook</h4>
                                    <p className="text-xs text-gray-500 font-medium">Not connected</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg font-bold text-gray-600">Connect</Button>
                        </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'dietary' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-50 pb-3 flex items-center gap-2">Dietary & Allergies <Leaf className="w-5 h-5 text-green-500" /></h3>
                  <p className="text-sm text-gray-500 font-medium mb-6">Select any dietary preferences or allergies. We'll highlight matching restaurants and warn you if an item contains an allergen.</p>
                  
                  <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-3">Dietary Lifestyles</h4>
                        <div className="flex flex-wrap gap-2">
                           {['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Halal'].map(diet => (
                              <button key={diet} className="px-4 py-2 rounded-lg border border-gray-200 bg-card text-sm font-bold text-gray-600 hover:border-[#2d5f4f] hover:text-[#2d5f4f] transition-all focus:bg-[#2d5f4f] focus:text-white">
                                {diet}
                              </button>
                           ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-3">Food Allergies & Intolerances</h4>
                        <div className="flex flex-wrap gap-2">
                           {['Peanuts', 'Tree Nuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Eggs'].map(allergy => (
                              <button key={allergy} className="px-4 py-2 rounded-lg border border-red-100 bg-red-50 text-sm font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all">
                                {allergy}
                              </button>
                           ))}
                        </div>
                      </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                      <Button className="h-11 rounded-xl px-8 text-sm font-bold bg-[#2d5f4f] hover:bg-[#1a382e] text-white">Save Preferences</Button>
                  </div>
               </div>
            )}

            {/* Keeping other tabs slim and tight */}
            {activeTab === 'privacy' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-50 pb-3 flex items-center gap-2">Privacy & Data <Shield className="w-5 h-5 text-[#2d5f4f]" /></h3>
                  <div className="space-y-4">
                     <p className="text-sm font-medium text-gray-500 mb-6">Manage how OyaEat handles your personal data.</p>
                     
                     <div className="p-4 border border-gray-200 rounded-xl bg-card flex justify-between items-center">
                        <div>
                           <h4 className="text-sm font-bold text-gray-900">Download My Data</h4>
                           <p className="text-xs text-gray-500 mt-0.5">Get a copy of your order history, receipts, and info.</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg font-bold">Request Archive</Button>
                     </div>

                     <div className="p-4 border border-red-100 rounded-xl bg-red-50/50 flex justify-between items-center mt-8">
                        <div>
                           <h4 className="text-sm font-bold text-red-700">Delete Account</h4>
                           <p className="text-xs text-red-500 mt-0.5 max-w-xs">Permanently delete your account and all associated data. This action cannot be reversed.</p>
                        </div>
                        <Button variant="destructive" size="sm" className="rounded-lg font-bold bg-red-600 hover:bg-red-700">Delete</Button>
                     </div>
                  </div>
               </div>
            )}

            {/* Referrals Code... */}
            {activeTab === 'referrals' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center py-6 px-4 bg-gradient-to-br from-[#2d5f4f] to-[#1e4035] rounded-2xl text-white mb-8">
                      <Gift className="w-10 h-10 mx-auto text-yellow-300 mb-3" />
                      <h3 className="text-xl font-extrabold">Give ₦1,000, Get ₦1,000!</h3>
                      <p className="text-sm text-green-100 mt-2 max-w-sm mx-auto">Share your code. When a friend signs up and places their first order, you both get ₦1,000 off.</p>
                  </div>
                  <div className="max-w-md mx-auto">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Your Invite Code</label>
                     <div className="flex items-center mt-2 relative">
                        <Input readOnly value={`OYA-${user.firstName?.toUpperCase()}-8X9`} className="h-14 rounded-xl bg-gray-50 font-extrabold text-lg text-center tracking-widest border-2 border-dashed border-[#2d5f4f]/30 text-[#2d5f4f]" />
                        <button 
                          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                          className="absolute right-2 top-2 bottom-2 px-4 bg-[#2d5f4f] text-white rounded-lg text-sm font-bold flex items-center hover:bg-[#1a382e] transition-colors"
                        >
                           {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {/* Same address and payments tabs but with tighter paddings... */}
            {activeTab === 'address' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-3">
                    <h3 className="text-xl font-extrabold text-gray-900">Address Book</h3>
                    <Button variant="outline" size="sm" className="rounded-lg border-dashed border-[#2d5f4f] text-[#2d5f4f] bg-[#2d5f4f]/5 hover:bg-[#2d5f4f]/10 font-bold">
                      + Add New
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-5 border-2 border-[#2d5f4f] bg-[#2d5f4f]/5 rounded-2xl relative">
                        <span className="absolute top-3 right-3 bg-[#2d5f4f] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Default</span>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">Home</h4>
                        <p className="text-gray-600 font-medium mb-3 text-xs leading-relaxed">15 Admiralty Way, Lekki Phase 1<br/>Lagos, Nigeria</p>
                        <div className="flex gap-3"><button className="text-blue-600 font-bold text-xs hover:underline">Edit</button></div>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTab === 'notifications' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-50 pb-3">Notification Preferences</h3>
                  <div className="space-y-1">
                     <label className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                       <div>
                         <h4 className="font-extrabold text-sm text-gray-900">Order Updates</h4>
                         <p className="text-xs font-medium text-gray-500">Live order status SMS and Email.</p>
                       </div>
                       <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[#2d5f4f] focus:ring-[#2d5f4f] cursor-pointer" />
                     </label>
                  </div>
               </div>
            )}
            
            {activeTab === 'payments' && (
               <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-50 pb-3">Payment Methods</h3>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-gray-500 text-sm font-medium mb-4">You haven't saved any payment cards yet.</p>
                    <Button className="rounded-xl px-5 bg-[#2d5f4f] text-white font-bold h-10 shadow-sm text-sm">
                      Add Payment Method
                    </Button>
                  </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
