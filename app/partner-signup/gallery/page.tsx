"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, Image as ImageIcon, Loader2, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/spalsh_oyaeat (3).png";

export default function PartnerSignupGalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Setup the missing base URL variable to match your configuration scheme
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Enforce the layout upper-bound constraints
      if (selectedFiles.length + filesArray.length > 5) {
        alert("Layout Constraint: You can upload a maximum of 5 display gallery photos.");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeStagedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!businessId) {
      setError("Missing business registration ID.");
      return;
    }

    if (selectedFiles.length < 3 || selectedFiles.length > 5) {
      setError("Please upload between 3 and 5 gallery images.");
      return;
    }

    setLoading(true);

    try {
      // Look for the correct token names used across your login and document pages
      const token = 
        localStorage.getItem("authToken") || 
        localStorage.getItem("vendor_token") || 
        localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication session token not found. Please log in again.");
      }

      const multipartData = new FormData();

      selectedFiles.forEach((file) => {
        multipartData.append("gallery", file);
      });

      // Targets: http://localhost:5000/api/vendor/:businessId/upload-gallery
      const res = await fetch(
        `${API_BASE_URL}/vendor/${businessId}/upload-gallery`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: multipartData,
        }
      );

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push("/partner-signup/success");
      } else {
        throw new Error(json.message || "Failed to upload showcase gallery files");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected server sync error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col">
      {/* Universal Flow Header */}
      <header className="py-6 px-8 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src={logo} alt="OyaEat Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
      </header>

      {/* Main Form Center Layout Context Container */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50/50">
        <form onSubmit={handleUploadSubmit} className="w-full max-w-xl bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 font-mono">Step 6 of 6</span>
            <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 mt-1">
              <ImageIcon className="text-[#2d5f4f] w-6 h-6" /> Storefront Showcase Photos
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Upload real kitchen, dish, or interior views. Customers see these photos directly on their app dashboard feed card grids.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          {/* Multipart drag & drop file box interface element */}
          <div className="border-2 border-dashed border-gray-200 hover:border-[#2d5f4f]/40 bg-gray-50/50 rounded-2xl p-8 text-center relative transition-all group cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-gray-700 block">Select visual files from desktop</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Please provide between 3 and 5 images total</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
          </div>

          {/* Staged file previews card element rows */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Staged Upload Gallery:</span>
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                    <img src={src} alt="Showcase Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeStagedImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || selectedFiles.length < 3} 
            className="w-full bg-[#2d5f4f] hover:bg-[#1e4035] text-white rounded-xl h-11 font-bold shadow transition-all"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Staging Cloud CDN Profiles...</>
            ) : (
              <><ArrowRight className="w-4 h-4 mr-2" /> Finish & Submit Application</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
