"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {/* Step 1: Add Business */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors duration-200 ${
            currentStep > 1 
              ? "bg-[#2d5f4f] text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {currentStep > 1 ? "✓" : "1"}
          </div>
          <span className={`font-medium text-sm ${currentStep >= 1 ? "text-gray-800" : "text-gray-400"}`}>
            Add Business
          </span>
        </div>

        {/* Connecting Progress Line */}
        <div className={`flex-1 h-0.5 transition-colors duration-300 ${
          currentStep >= 2 ? "bg-[#2d5f4f]" : "bg-gray-200"
        }`}></div>

        {/* Step 2: Verify Business */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors duration-200 ${
            currentStep >= 2 
              ? "bg-[#2d5f4f] text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {currentStep > 2 ? "✓" : "2"}
          </div>
          <span className={`font-semibold text-sm ${currentStep >= 2 ? "text-[#2d5f4f]" : "text-gray-400"}`}>
            Verify Business
          </span>
        </div>
      </div>
    </div>
  );
}
