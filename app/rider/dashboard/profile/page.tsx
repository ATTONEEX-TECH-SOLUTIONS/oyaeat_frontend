"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { User, ShieldCheck, Loader2, Camera, CheckCircle2 } from "lucide-react";
import { RiderProfileFields } from "@/components/rider/RiderProfileFields";

export default function RiderProfileSetup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    vehicleType: "Motorcycle",
    plateNumber: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem("riderToken");
        const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.profile?.firstName || "",
            lastName: data.profile?.lastName || "",
            phone: data.profile?.phone || "", 
            vehicleType: data.profile?.vehicleType || "Motorcycle",
            plateNumber: data.profile?.plateNumber || ""
          });
          setIsVerified(!!data.profile?.isVerified);

          if (data.profile?.avatarUrl) {
            setPreviewUrl(data.profile.avatarUrl.startsWith("http") ? data.profile.avatarUrl : `${API_BASE_URL}${data.profile.avatarUrl}`);
          }
        }
      } catch (err) {
        console.error("Failed loading configuration profiles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, [API_BASE_URL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 11) {
      setPhoneError("Cannot save profile. Phone number must be exactly 11 digits.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("riderToken");
      const dataPayload = new FormData();
      dataPayload.append("firstName", formData.firstName);
      dataPayload.append("lastName", formData.lastName);
      dataPayload.append("phone", formData.phone);
      dataPayload.append("vehicleType", formData.vehicleType);
      dataPayload.append("plateNumber", formData.plateNumber);
      
      if (selectedFile) {
        dataPayload.append("avatar", selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/rider/profile/update`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataPayload
      });

      if (response.ok) {
        alert("Profile saved successfully!");
      }
    } catch (err) {
      console.error("Update request error", err);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return `${formData.firstName?.substring(0, 1) || ""}${formData.lastName?.substring(0, 1) || ""}`.toUpperCase() || "R";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    // 💡 THE SPACE FIX: Wrap in a container with a flexible background, removing min-h-screen/stretch from the card block
    <div className="p-4 md:p-6 w-full flex flex-col justify-start items-start">
      <div className="w-full  bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Profile Settings</h2>
            <p className="text-[11px] text-slate-500">Update account particulars, avatar registration data and vehicle type indicators.</p>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
            isVerified ? "bg-green-50 border border-green-200 text-green-700" : "bg-amber-50 border border-amber-200 text-amber-700"
          }`}>
            {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
            {isVerified ? "Verified Operator" : "Awaiting Verification"}
          </div>
        </div>

        {/* Content Row: Explicitly avoids forcing stretch behavior */}
        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-200/60 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Image</span>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-16 h-16 rounded-full bg-emerald-800 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Avatar Preview" fill className="object-cover group-hover:brightness-75 transition-all" unoptimized />
              ) : (
                <span className="text-white font-bold text-sm tracking-wider group-hover:opacity-20 transition-opacity">{getInitials()}</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <p className="text-[9px] text-slate-400 mt-2 font-medium">Click image to update</p>
          </div>

          {/* Form Content Block */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">First Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Last Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                </div>
              </div>

            </div>

            {/* Split Input Form Block */}
            <RiderProfileFields 
              formData={formData} 
              setFormData={setFormData} 
              saving={saving} 
              phoneError={phoneError}
              setPhoneError={setPhoneError}
          />
          
          </div>
        </form>
      </div>
    </div>
  );
}
