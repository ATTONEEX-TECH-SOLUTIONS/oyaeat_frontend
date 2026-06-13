"use client";

import Link from "next/link";

export default function SignupHeader() {
  return (
    <header className="py-6 px-8 border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center gap-2 w-fit">
        <span className="text-xl font-bold">
          <span className="text-[#2d5f4f]">Oya</span>
          <span className="text-gray-900">Eat</span>
        </span>
      </Link>
    </header>
  );
}
