import Image from 'next/image';
import { Star, Clock, Heart, ArrowRight, Flame } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  price: string;
  image: string;
  isPopular?: boolean;
  discount?: string;
}

export default function NearbyRestaurants({ data }: { data: Restaurant[] }) {
  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1400px] mx-auto">

      {/* Section Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2d5f4f]/8 text-[#2d5f4f] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
            <Flame className="w-3.5 h-3.5" />
            Trending Near You
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Popular Restaurants Nearby
          </h2>
          <p className="text-gray-500 mt-1.5 text-sm font-medium">
            Top-rated vendors delivering sharp sharp to your door
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-4 py-2 rounded-lg hover:bg-[#2d5f4f] hover:text-white hover:border-[#2d5f4f] transition-all duration-200 group">
          See All
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#2d5f4f]/20 transition-all duration-200 cursor-pointer group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Top overlay: badges + wishlist */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Popular badge */}
              {restaurant.isPopular && (
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-orange-500 text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                  <Flame className="w-3 h-3" />
                  Popular
                </div>
              )}

              {/* Discount badge */}
              {restaurant.discount && (
                <div className="absolute top-3 left-3 bg-[#2d5f4f] text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                  {restaurant.discount}
                </div>
              )}

              {/* Wishlist */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors group/btn">
                <Heart className="w-3.5 h-3.5 text-gray-500 group-hover/btn:text-red-500 group-hover/btn:fill-red-500 transition-colors" />
              </button>

              {/* Delivery time pill overlaid on image bottom */}
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Clock className="w-3 h-3 text-[#2d5f4f]" />
                {restaurant.time}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#2d5f4f] transition-colors duration-200 line-clamp-1">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">{restaurant.cuisine}</p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{restaurant.rating.toFixed(1)}</span>
                </div>

                {/* Price range */}
                <span className="text-xs font-bold text-[#2d5f4f] bg-[#2d5f4f]/8 px-2.5 py-1 rounded-md">
                  {restaurant.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile See All */}
      <div className="mt-8 sm:hidden text-center">
        <button className="inline-flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-6 py-2.5 rounded-lg hover:bg-[#2d5f4f] hover:text-white hover:border-[#2d5f4f] transition-all duration-200">
          See All Restaurants
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
}