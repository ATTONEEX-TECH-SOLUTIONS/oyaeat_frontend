"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessType: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const token = data.token || data.authToken || data.data?.token || data.user?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }

      sessionStorage.setItem("partnerSignupData", JSON.stringify({
        ...formData,
        userId: data.userId || data.id || data.user?.id || data.data?.userId,
      }));
      
      router.push("/partner-signup/verify-phone");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => updateFormData("firstName", e.target.value)}
        className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-900 placeholder-gray-600 shadow-sm"
        placeholder="First name *"
        required
        disabled={isLoading}
      />

      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => updateFormData("lastName", e.target.value)}
        className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-900 placeholder-gray-600 shadow-sm"
        placeholder="Last name *"
        required
        disabled={isLoading}
      />

      <select
  value={formData.businessType}
  onChange={(e) => updateFormData("businessType", e.target.value)}
  className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-700 shadow-sm"
  required
  disabled={isLoading}
>
  <option value="">Business type *</option>
  <option value="dine_in_delivery">Dine-in Restaurant (with Delivery)</option>
  <option value="cloud_kitchen">Cloud Kitchen / Ghost Kitchen (Delivery Only)</option>
  <option value="fast_food_takeaway">Fast Food & Takeaway</option>
  <option value="home_chef">Home Chef / Home-based Kitchen</option>
  <option value="catering">Catering Service (Bulk Delivery)</option>
  <option value="food_truck">Food Truck</option>
</select>


      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData("email", e.target.value)}
        className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-900 placeholder-gray-600 shadow-sm"
        placeholder="Email *"
        required
        disabled={isLoading}
      />

      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => updateFormData("phone", e.target.value)}
        className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-900 placeholder-gray-600 shadow-sm"
        placeholder="Phone number *"
        required
        disabled={isLoading}
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => updateFormData("password", e.target.value)}
        className="w-full px-4 py-3 bg-white border border-white/40 rounded-lg outline-none text-gray-900 placeholder-gray-600 shadow-sm"
        placeholder="Password *"
        required
        minLength={8}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating your account...
          </span>
        ) : (
          "Get Started"
        )}
      </button>
    </form>
  );
}
