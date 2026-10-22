"use client";

import React from "react";
import { DollarSign } from "lucide-react";

export const DELIVERY_DEFAULTS = {
  "fees.deliveryBase": 500,
  "fees.deliveryPerKm": 150,
  "fees.deliveryMin": 800,
  "fees.deliveryMax": 5000,
  "fees.baseDeliveryFee": 1500,
  "fees.riderSharePercent": 80,
};
export type DeliverySettings = typeof DELIVERY_DEFAULTS;

const DELIVERY_FIELDS: { key: keyof DeliverySettings; label: string; hint: string }[] = [
  { key: "fees.deliveryBase", label: "Delivery base fee (₦)", hint: "Charged before any distance." },
  { key: "fees.deliveryPerKm", label: "Per kilometre (₦)", hint: "Added for each km of road distance." },
  { key: "fees.deliveryMin", label: "Minimum delivery fee (₦)", hint: "Short trips never cost less." },
  { key: "fees.deliveryMax", label: "Maximum delivery fee (₦)", hint: "Long trips never cost more." },
  { key: "fees.baseDeliveryFee", label: "Flat fee when distance is unknown (₦)", hint: "Used if the restaurant or address has no location." },
  { key: "fees.riderSharePercent", label: "Rider's share of delivery fee (%)", hint: "The platform keeps the rest." },
];

interface CommissionFeesProps {
  platformCommission: number;
  setPlatformCommission: (val: number) => void;
  baseRiderFee: number;
  setBaseRiderFee: (val: number) => void;
  delivery: DeliverySettings;
  setDelivery: (val: DeliverySettings) => void;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#5b21b6] focus:bg-white transition-all text-sm";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-[#5b21b6] mb-2";

export function CommissionFees({
  platformCommission,
  setPlatformCommission,
  baseRiderFee,
  setBaseRiderFee,
  delivery,
  setDelivery,
}: CommissionFeesProps) {
  return (
    <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <DollarSign className="w-6 h-6 text-[#5b21b6]" />
        <h2 className="text-xl font-bold text-gray-900">Commission & Fees</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Global Platform Commission (%)</label>
          <input
            type="number"
            value={platformCommission}
            onChange={(e) => setPlatformCommission(Number(e.target.value))}
            className={inputCls}
          />
          <p className="mt-1.5 text-xs text-gray-500">Taken from the food total of each order.</p>
        </div>
        <div>
          <label className={labelCls}>Fallback Rider Fee (₦)</label>
          <input
            type="number"
            value={baseRiderFee}
            onChange={(e) => setBaseRiderFee(Number(e.target.value))}
            className={inputCls}
          />
          <p className="mt-1.5 text-xs text-gray-500">Only for orders placed before delivery fees existed.</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-900">Delivery fee (paid by the customer)</h3>
        <p className="mt-1 mb-5 text-xs text-gray-500">
          Fee = base + per-km × road distance, kept between the minimum and maximum and rounded to ₦50. Each order stores its own fee, so changes here only affect new orders.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DELIVERY_FIELDS.map((f) => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input
                type="number"
                min={0}
                max={f.key === "fees.riderSharePercent" ? 100 : undefined}
                value={delivery[f.key]}
                onChange={(e) => setDelivery({ ...delivery, [f.key]: Number(e.target.value) })}
                className={inputCls}
              />
              <p className="mt-1.5 text-xs text-gray-500">{f.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
