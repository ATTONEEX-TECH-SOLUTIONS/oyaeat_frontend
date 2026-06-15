import { ShoppingCart, ShoppingBag, Store, HeartPulse } from "lucide-react";
import { SolutionItem } from "@/lib/data/data";

const iconMap: Record<string, any> = {
  "shopping-cart": <ShoppingCart className="w-12 h-12" />,
  "shopping-bag": <ShoppingBag className="w-12 h-12" />,
  "store": <Store className="w-12 h-12" />,
  "heart-pulse": <HeartPulse className="w-12 h-12" />,
};

export default function PartnerSolutions({ data }: { data: SolutionItem[] }) {
  return (
    <section className="py-20 px-6 bg-[#2d5f4f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Find the best solution for your business
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Whatever your business type, we have the perfect solution to help you grow and reach more customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((solution, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-[#2d5f4f] mb-6">{iconMap[solution.icon]}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
              <p className="text-gray-700 mb-6">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#2d5f4f] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
