"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface AutocompleteProps {
  onAddressSelected: (address: string, coords: { lat: number; lng: number }) => void;
  disabled?: boolean;
}

export default function AddressAutocomplete({ onAddressSelected, disabled }: AutocompleteProps) {
  const placesLibrary = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    // Instantiate Google Places Autocomplete over the input reference
    const options = {
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: "ng" }, // Restricts address search predictions strictly to Nigeria
    };

    const instance = new placesLibrary.Autocomplete(inputRef.current, options);
    setAutocomplete(instance);
  }, [placesLibrary]);

  useEffect(() => {
    if (!autocomplete) return;

    // Listen for when a customer clicks an address option from the dropdown list
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.warn("Selected address location is missing valid geometric data.");
        return;
      }

      const formattedAddress = place.formatted_address || "";
      const locationCoords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      // Bubble the verified text and coordinates straight up to the parent checkout form state
      onAddressSelected(formattedAddress, locationCoords);
    });
  }, [autocomplete, onAddressSelected]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Delivery Dropoff Address *
      </label>
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        placeholder="Type your street address, estate, or building name..."
        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none disabled:bg-gray-100 transition shadow-sm text-sm"
      />
    </div>
  );
}
