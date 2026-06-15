'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from "@/components/landing-page/Navbar";
import Hero from '@/components/landing-page/Hero';
import LetsDoItTogether from '@/components/landing-page/LetsDoItTogether';
import NearbyRestaurants from '@/components/landing-page/NearbyRestaurants';
import PersonalizedRecommendations from '@/components/landing-page/PersonalizedRecommendations';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/landing-page/Footer';

export default function Home() {
  const nearbyRestaurants = [
    { id: 1, name: 'Iyan Alata - Pounded Yam Hub', cuisine: 'Local Swallows & Soups', rating: 4.8, time: '25 Mins', price: '₦4,500 for two', image: '/landing/9.jpg' },
    { id: 2, name: 'Kilimanjaro Express', cuisine: 'Naija Delicacies', rating: 4.2, time: '30 Mins', price: '₦5,000 for two', image: '/landing/2.jpg' },
    { id: 3, name: 'The Asun & Grill Joint', cuisine: 'Street Food & Grills', rating: 4.5, time: '20 Mins', price: '₦3,500 for two', image: '/landing/3.jpg' },
    { id: 4, name: 'Mega Chicken Fast Food', cuisine: 'Continental & Local', rating: 4.0, time: '25 Mins', price: '₦6,000 for two', image: '/landing/4.jpg' },
    { id: 5, name: 'Green Grill - Healthy Bowls', cuisine: 'Salads & Healthy Sides', rating: 4.5, time: '40 Mins', price: '₦7,000 for two', image: '/landing/5.jpg' },
    { id: 6, name: 'The Place Restaurant', cuisine: 'Rice Meals & Combos', rating: 4.6, time: '25 Mins', price: '₦4,000 for two', image: '/landing/6.jpg' },
    { id: 7, name: 'Gidi Pizza & Shawarma Hub', cuisine: 'Pastries & Fast Food', rating: 4.1, time: '20 Mins', price: '₦5,500 for two', image: '/landing/7.jpg' },
    { id: 8, name: 'Calabar Kitchen Delights', cuisine: 'Edikang Ikong & Soups', rating: 4.9, time: '45 Mins', price: '₦8,000 for two', image: '/landing/8.jpg' }
  ];

  const recommendedItems = [
    { id: 1, name: 'Jollof Rice with Grilled Chicken', restaurant: 'Mama Nkechi Kitchen', price: '₦2,500', time: '30 Mins', rating: 4.6, image: '/categories/jollof.jpg' },
    { id: 2, name: 'Suya with Onions & Pepper', restaurant: 'Abuja Suya Spot', price: '₦1,800', time: '20 Mins', rating: 4.5, image: '/categories/suya.jpg' },
    { id: 3, name: 'Pounded Yam & Egusi Soup', restaurant: 'Yam & Egusi Corner', price: '₦2,700', time: '35 Mins', rating: 4.4, image: '/landing/pounded-yam-egusi.jpg' },
    { id: 4, name: 'Pepper Soup (Catfish)', restaurant: 'Pepper Soup Palace', price: '₦3,000', time: '25 Mins', rating: 4.3, image: '/categories/pepper-soup.jpg' }
  ];

  const categories = [
    { name: 'Ofada Rice', image: '/categories/ofada.jpg' },
    { name: 'Amala & Ewedu', image: '/categories/amala.jpg' },
    { name: 'Moi Moi', image: '/categories/jollof.jpg' },
    { name: 'Akara & Pap', image: '/categories/puff.jpg' },
    { name: 'Small Chops', image: '/categories/suya.jpg' },
    { name: 'Grilled Chicken', image: '/categories/grilled-chicken.jpg' }
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* NearBy Component */}
      <NearbyRestaurants data={nearbyRestaurants} />

      {/* Let's Do It Together Section */}
      <LetsDoItTogether />

      {/* What's on your mind? Section */}
        <section className="py-20 px-6 lg:px-10 bg-white border-t border-gray-100">
    <div className="max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2d5f4f]/8 text-[#2d5f4f] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
            Browse Categories
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            What&apos;s on your mind?
          </h2>
          <p className="text-gray-400 mt-1.5 text-sm font-medium">
            Explore categories tailored for your cravings
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-4 py-2 rounded-lg hover:bg-[#2d5f4f] hover:text-white hover:border-[#2d5f4f] transition-all duration-200 group flex-shrink-0">
          All Categories
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* Scrollable Category Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start cursor-pointer group flex flex-col items-center gap-3"
          >
            {/* Circle image with ring on hover */}
            <div className="relative w-[104px] h-[104px] rounded-full p-[3px] bg-gray-100 group-hover:bg-[#2d5f4f] transition-colors duration-200 shadow-sm group-hover:shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="104px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Subtle dark vignette so the label reads against varied images */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>

            {/* Label */}
            <p className="text-xs font-bold text-gray-700 group-hover:text-[#2d5f4f] transition-colors duration-200 text-center leading-tight max-w-[90px]">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile all categories */}
      <div className="mt-7 sm:hidden text-center">
        <button className="inline-flex items-center gap-2 text-sm text-[#2d5f4f] font-bold border border-[#2d5f4f]/30 px-6 py-2.5 rounded-lg hover:bg-[#2d5f4f] hover:text-white transition-all duration-200">
          All Categories
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  </section>
      {/* Recommendations Component */}
      <PersonalizedRecommendations data={recommendedItems} />

      {/* Footer */}

          <Footer/>
      
    </main>
  );
}
