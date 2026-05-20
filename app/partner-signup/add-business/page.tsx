"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddBusinessPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── NEW GEOLOCATION COORDINATE STATES ──
  const [markerPos, setMarkerPos] = useState({ lat: 6.5244, lng: 3.3792 }); // Lagos default fallback

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("partnerSignupData");
      if (raw) {
        const parsed = JSON.parse(raw);
        const id = Number(parsed?.userId);
        if (!Number.isNaN(id) && id > 0) setUserId(id);
      }
    } catch {}
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // ── NEW: HANDLE OWNER DRAGGING OR CLICKING MAP MARKER ──
  const handleMapClick = (e: any) => {
    if (!e.detail.latLng) return;
    setMarkerPos({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in. Please login again.");
        router.push("/restaurant/login");
        return;
      }

      if (!userId) {
        setError("Missing user ID. Please restart signup or login again.");
        router.push("/restaurant/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/vendor/${userId}/business-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessType: formData.businessType,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          businessPhone: formData.businessPhone,
          businessEmail: formData.businessEmail,
          websiteUrl: formData.website || null,
          description: formData.description,
          // ── NEW: DYNAMIC TELEMETRY KEY VALUES ATTACHED SECURELY ──
          latitude: markerPos.lat,
          longitude: markerPos.lng,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Failed to save business details (${res.status})`);
      }

      const businessId =
        data?.businessId || data?.id || data?.business?.id || data?.data?.businessId;

      if (!businessId) {
        throw new Error("Business created but businessId was not returned.");
      }

      sessionStorage.setItem(
        "businessData",
        JSON.stringify({
          businessName: formData.businessName,
          businessId,
        }),
      );

      router.push(`/partner-signup/verify-business?businessId=${businessId}&businessName=${encodeURIComponent(formData.businessName)}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="text-[#2d5f4f] font-semibold">Add Business</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="text-gray-500">Verify Business</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add your business</h1>
          <p className="text-gray-600 mb-8">
            Please provide accurate information about your business.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-100"
              >
                <option value="">Select business type</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Cafe</option>
                <option value="bakery">Bakery</option>
                <option value="fastfood">Fast Food</option>
                <option value="foodtruck">Food Truck</option>
                <option value="catering">Catering Service</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-100 mb-4"
                placeholder="Enter street address"
              />
            </div>

            {/* ── MAP PICKER INGESTION AREA ── */}
            <div className="space-y-2 border border-gray-200 p-4 rounded-xl bg-gray-50">
              <label className="block text-sm font-bold text-gray-800">
                Pin Storefront Entry Door *
              </label>
              <p className="text-xs text-gray-500">
                Click directly on the canvas grid block mapping below to pin the exact pickup location.
              </p>
              <div className="h-[280px] w-full rounded-lg overflow-hidden shadow-inner border border-gray-300">
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                  <Map
                    defaultZoom={13}
                    center={markerPos}
                    onClick={handleMapClick}
                    mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"}
                    disableDefaultUI={true}
                    zoomControl={true}
                  >
                    <Marker position={markerPos} />
                  </Map>
                </APIProvider>
              </div>
              <div className="flex gap-4 text-xs font-mono text-gray-500 bg-white p-2 border border-gray-200 rounded-lg">
                <span>Lat: {markerPos.lat.toFixed(6)}</span>
                <span>Lng: {markerPos.lng.toFixed(6)}</span>
              </div>
            </div>

            {/* ── City, State, Zip Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  placeholder="Zip"
                />
              </div>
            </div>

            {/* ── Contact Info Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Phone *
                </label>
                <input
                  type="text"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none"
                  placeholder="business@example.com"
                />
              </div>
            </div>

            {/* ── Optional Website ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none"
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            {/* ── Business Description ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                disabled={isLoading}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none resize-none"
                placeholder="Tell us about your business..."
              />
            </div>

            {/* ── Form Navigation Buttons ── */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
