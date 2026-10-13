"use client";

interface UploadProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export default function UploadProgressBar({
  completedCount,
  totalCount,
}: UploadProgressBarProps) {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-700">
          Compliance Progress
        </span>
        <span className="text-xs font-black text-[#5b21b6] bg-[#5b21b6]/10 px-2.5 py-1 rounded-full">
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#5b21b6] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
