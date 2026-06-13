"use client";

export default function StepIndicator() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center font-semibold text-xs">
            ✓
          </div>
          <span className="text-gray-600 font-medium text-sm">Add Business</span>
        </div>
        <div className="flex-1 h-0.5 bg-[#2d5f4f]"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center font-semibold text-xs">
            2
          </div>
          <span className="text-[#2d5f4f] font-semibold text-sm">Verify Business</span>
        </div>
      </div>
    </div>
  );
}
