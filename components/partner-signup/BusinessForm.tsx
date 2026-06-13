import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface BusinessFormProps {
  formData: any;
  markerPos: { lat: number; lng: number };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleMapClick: (e: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function BusinessForm({
  formData,
  markerPos,
  isLoading,
  handleChange,
  handleMapClick,
  handleSubmit,
  onBack,
}: BusinessFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Business Name *</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-100"
          placeholder="Enter street address"
        />
      </div>

      <div className="space-y-2 border border-gray-200 p-4 rounded-xl bg-gray-50">
        <label className="block text-sm font-bold text-gray-800">Pin Storefront Entry Door *</label>
        <p className="text-xs text-gray-500">Click directly on the canvas grid block mapping below to pin the exact pickup location.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none" placeholder="City" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none" placeholder="State" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg outline-none" placeholder="Zip" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone *</label>
          <input type="text" name="businessPhone" value={formData.businessPhone} onChange={handleChange} required disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none" placeholder="+234 XXX XXX XXXX" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Email *</label>
          <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} required disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none" placeholder="business@example.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
        <input type="url" name="website" value={formData.website} onChange={handleChange} disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none" placeholder="https://yourbusiness.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} disabled={isLoading} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none resize-none" placeholder="Tell us about your business..." />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} disabled={isLoading} className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Back
        </button>
        <button type="submit" disabled={isLoading} className="flex-1 bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
