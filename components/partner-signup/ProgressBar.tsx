export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? "bg-[#5b21b6] text-white" : "bg-gray-300 text-gray-600"}`}
          >
            1
          </div>
          <span
            className={`${currentStep >= 1 ? "text-[#5b21b6]" : "text-gray-500"} font-semibold`}
          >
            Add Business
          </span>
        </div>
        <div
          className={`flex-1 h-0.5 ${currentStep > 1 ? "bg-[#5b21b6]" : "bg-gray-300"}`}
        ></div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? "bg-[#5b21b6] text-white" : "bg-gray-300 text-gray-600"}`}
          >
            2
          </div>
          <span
            className={`${currentStep >= 2 ? "text-[#5b21b6]" : "text-gray-500"} font-semibold`}
          >
            Verify Business
          </span>
        </div>
      </div>
    </div>
  );
}
