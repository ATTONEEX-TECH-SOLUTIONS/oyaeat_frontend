"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Crosshair, Loader2 } from "lucide-react";
import { Field, fieldClass } from "./ui";

interface BusinessFormProps {
  subStep: number;
  formData: any;
  markerPos: { lat: number; lng: number };
  pinMoved: boolean;
  locating: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleMapClick: (e: any) => void;
  onLocate: () => void;
}

export default function BusinessForm({ subStep, formData, markerPos, pinMoved, locating, isLoading, handleChange, handleMapClick, onLocate }: BusinessFormProps) {
  const common = { onChange: handleChange, disabled: isLoading, className: fieldClass };

  if (subStep === 1) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="businessName" label="Business name" className="sm:col-span-2">
          <input id="businessName" name="businessName" value={formData.businessName} placeholder="e.g. Mama Titi's Kitchen" {...common} />
        </Field>
        <Field id="businessType" label="Business type">
          <select id="businessType" name="businessType" value={formData.businessType} {...common}>
            <option value="">Select a type</option>
            <option value="buka_mamaput">Local Buka / Mama Put</option>
              <option value="fastfood_qsr">Fast Food / QSR Chain</option>
              <option value="casual_dining">
                Casual / Continental Restaurant
              </option>
              <option value="ghost_kitchen">
                Cloud / Delivery-Only Kitchen
              </option>
              <option value="pastries_bakery">
                Pastries, Shawarma & Confectionery
              </option>
              <option value="supermarket_grocery">
                Groceries & Supermarket
              </option>
              <option value="drinks_liquor">Drinks & Wholesale Beverage</option>
            
          </select>
        </Field>
        <Field id="businessPhone" label="Business phone">
          <input id="businessPhone" name="businessPhone" type="tel" inputMode="tel" autoComplete="tel" value={formData.businessPhone} placeholder="0803 000 0000" {...common} />
        </Field>
        <Field id="businessEmail" label="Business email">
          <input id="businessEmail" name="businessEmail" type="email" autoComplete="email" value={formData.businessEmail} placeholder="hello@yourbusiness.com" {...common} />
        </Field>
        <Field id="website" label="Website" optional>
          <input id="website" name="website" type="url" value={formData.website} placeholder="https://" {...common} />
        </Field>
        <Field id="description" label="Description" hint="A sentence or two about what makes you special." className="sm:col-span-2">
          <textarea id="description" name="description" rows={3} value={formData.description} placeholder="Tell customers what you cook and what you're known for" onChange={handleChange} disabled={isLoading} className={`${fieldClass} h-auto resize-none py-3`} />
        </Field>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field id="streetAddress" label="Street address" className="sm:col-span-3">
        <input id="streetAddress" name="streetAddress" autoComplete="street-address" value={formData.streetAddress} placeholder="e.g. 14 Awolowo Road" {...common} />
      </Field>
      <Field id="city" label="City">
        <input id="city" name="city" autoComplete="address-level2" value={formData.city} {...common} />
      </Field>
      <Field id="state" label="State">
        <input id="state" name="state" autoComplete="address-level1" value={formData.state} {...common} />
      </Field>
      <Field id="zipCode" label="Postcode" optional>
        <input id="zipCode" name="zipCode" autoComplete="postal-code" value={formData.zipCode} placeholder="100001" {...common} />
      </Field>

      <div className="sm:col-span-3">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold">Pin your storefront</p>
          <button
            type="button"
            onClick={onLocate}
            disabled={locating || isLoading}
            className="flex h-9 items-center gap-2 rounded-full bg-violet-100 px-4 text-xs font-bold text-violet-900 transition hover:bg-violet-200 disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />} Use my current location
          </button>
        </div>
        <div className="h-56 w-full overflow-hidden rounded-2xl border border-border sm:h-64">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <Map defaultZoom={13} center={markerPos} onClick={handleMapClick} mapId={process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID"} disableDefaultUI={true} zoomControl={true}>
              <Marker position={markerPos} />
            </Map>
          </APIProvider>
        </div>
        <p className={`mt-1.5 text-xs ${pinMoved ? "font-semibold text-success" : "text-muted-foreground"}`}>
          {pinMoved ? "✓ Pin placed. Tap the map to adjust it." : "Tap the map where your storefront is, or use your current location."}
        </p>
      </div>
    </div>
  );
}
