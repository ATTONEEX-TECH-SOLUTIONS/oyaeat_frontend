"use client";

interface UploadProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export default function UploadProgressBar({ completedCount, totalCount }: UploadProgressBarProps) {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-gray-700">Compliance Progress</span>
        <span className="text-sm font-black text-[#2d5f4f] bg-[#2d5f4f]/10 px-3 py-1 rounded-full">
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-[#2d5f4f] h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
