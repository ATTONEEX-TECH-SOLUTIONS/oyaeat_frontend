"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface AutocompleteProps {
  onAddressSelected: (
    address: string,
    coords: { lat: number; lng: number },
  ) => void;
  disabled?: boolean;
  /** Pass null to hide the built-in label (when the parent renders its own). */
  label?: string | null;
  /** Called when the user edits the text after picking a suggestion. */
  onClear?: () => void;
}

export default function AddressAutocomplete({
  onAddressSelected,
  disabled,
  label = "Delivery Dropoff Address *",
  onClear,
}: AutocompleteProps) {
  const placesLibrary = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
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
        console.warn(
          "Selected address location is missing valid geometric data.",
        );
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
      {label !== null && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        onChange={() => onClear?.()}
        autoComplete="off"
        aria-label="Delivery address"
        placeholder="Type your street address, estate, or building name..."
        className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60"
      />
    </div>
  );
}
