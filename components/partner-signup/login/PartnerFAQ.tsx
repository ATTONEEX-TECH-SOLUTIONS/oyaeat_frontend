"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/lib/data/data";

export default function PartnerFAQ({ data }: { data: FAQItem[] }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-[#2d5f4f]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-white/90">Got questions? We've got answers</p>
        </div>

        <div className="space-y-4">
          {data.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div key={index} className="border border-white/20 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#2d5f4f] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 border-t border-gray-200" : "max-h-0"}`}>
                  <p className="px-6 py-5 text-gray-700 bg-white text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

