import Image from 'next/image';
import { Star, Clock, Plus, Sparkles } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface RecommendationItem {
  id: number;
  name: string;
  restaurant: string;
  price: string;
  time: string;
  rating: number;
  image: string;
}

export default function PersonalizedRecommendations({ data }: { data: RecommendationItem[] }) {
  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2d5f4f]/8 text-[#2d5f4f] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Just for You
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Personalized Picks
          </h2>
          <p className="text-gray-400 mt-1.5 text-sm font-medium">
            Dishes picked specifically for your taste profile
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-4 py-2 rounded-lg hover:bg-[#2d5f4f] hover:text-white hover:border-[#2d5f4f] transition-all duration-200 group flex-shrink-0">
          See All
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#2d5f4f]/20 transition-all duration-200 cursor-pointer group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-44 bg-gray-100 overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

              {/* Delivery time overlaid on image */}
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Clock className="w-3 h-3 text-[#2d5f4f]" />
                {item.time}
              </div>

              {/* Quick add button */}
              <button
                className="absolute bottom-3 right-3 w-7 h-7 bg-[#2d5f4f] text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#234a3d]"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#2d5f4f] transition-colors duration-200 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium line-clamp-1">{item.restaurant}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-base font-black text-gray-900">{item.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile see all */}
      <div className="mt-8 sm:hidden text-center">
        <button className="inline-flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-6 py-2.5 rounded-lg hover:bg-[#2d5f4f] hover:text-white transition-all duration-200">
          See All Picks
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
}