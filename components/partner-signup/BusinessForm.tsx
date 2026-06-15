// components/partner-signup/BusinessForm.tsx
"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface BusinessFormProps {
  subStep: number;
  formData: any;
  markerPos: { lat: number; lng: number };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleMapClick: (e: any) => void;
}

const inputClass =
  "w-full text-gray-900 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-50 text-sm font-medium placeholder:text-gray-400 transition-shadow";

const labelClass = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

export default function BusinessForm({
  subStep,
  formData,
  markerPos,
  isLoading,
  handleChange,
  handleMapClick,
}: BusinessFormProps) {
  return (
    <>
      {subStep === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Business Name — full width */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="e.g. Mama Titi's Kitchen"
            />
          </div>

                   {/* Type */}
          <div>
            <label className={labelClass}>Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
            >
              <option value="">Select type</option>
              <option value="buka_mamaput">Local Buka / Mama Put</option>
              <option value="fastfood_qsr">Fast Food / QSR Chain</option>
              <option value="casual_dining">Casual / Continental Restaurant</option>
              <option value="ghost_kitchen">Cloud / Delivery-Only Kitchen</option>
              <option value="pastries_bakery">Pastries, Shawarma & Confectionery</option>
              <option value="supermarket_grocery">Groceries & Supermarket</option>
              <option value="drinks_liquor">Drinks & Wholesale Beverage</option>
            </select>
          </div>


          {/* Phone */}
          <div>
            <label className={labelClass}>Business Phone *</label>
            <input
              type="text"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Business Email *</label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="business@example.com"
            />
          </div>

          {/* Website */}
          <div>
            <label className={labelClass}>Website <span className="normal-case font-medium text-gray-400">(optional)</span></label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={isLoading}
              className={inputClass}
              placeholder="https://oyaeat.com"
            />
          </div>

          {/* Description — full width */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Business Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              disabled={isLoading}
              className={`${inputClass} resize-none`}
              placeholder="Tell customers what makes your business special…"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Street — full width */}
          <div className="sm:col-span-3">
            <label className={labelClass}>Street Address *</label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="e.g. 14 Awolowo Road"
            />
          </div>

          {/* City */}
          <div>
            <label className={labelClass}>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="City"
            />
          </div>

          {/* State */}
          <div>
            <label className={labelClass}>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputClass}
              placeholder="State"
            />
          </div>

          {/* Zip */}
          <div>
            <label className={labelClass}>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={isLoading}
              className={inputClass}
              placeholder="100001"
            />
          </div>

          {/* Map pin */}
          <div className="sm:col-span-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass + " mb-0"}>Pin your storefront *</label>
              <span className="text-[10px] text-gray-400 font-medium">Tap the map to move the pin</span>
            </div>
            <div className="h-40 w-full rounded-xl overflow-hidden border border-gray-200">
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
            <div className="flex gap-4 mt-2 text-[11px] font-mono text-gray-400">
              <span>Lat: {markerPos.lat.toFixed(6)}</span>
              <span>Lng: {markerPos.lng.toFixed(6)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}