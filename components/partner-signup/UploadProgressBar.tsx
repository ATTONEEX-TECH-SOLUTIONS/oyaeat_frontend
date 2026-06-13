"use client";

interface UploadProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export default function UploadProgressBar({ completedCount, totalCount }: UploadProgressBarProps) {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Upload Progress</span>
        <span className="text-sm font-semibold text-[#2d5f4f]">
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#2d5f4f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
