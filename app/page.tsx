'use client';

import Link from 'next/link';
import { Search, Star, Clock, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from "@/components/navbar/Navbar"
import Hero from '@/components/hero/Hero';
import LetsDoItTogether from '@/components/lets-do-it-together/LetsDoItTogether';
import Image from 'next/image';

export default function Home() {
  const nearbyRestaurants = [
    {
      id: 1,
      name: 'Ramachandra Parlour',
      cuisine: 'south indian',
      rating: 4.0,
      time: '30 Mins',
      price: '200 for two',
      image: '/landing/9.jpg'
    },
    {
      id: 2,
      name: 'Uma Parlour - Pure Vegetarian',
      cuisine: 'south indian',
      rating: 3.2,
      time: '30 Mins',
      price: '165 for two',
      image: '/landing/2.jpg'
    },
    {
      id: 3,
      name: 'Paneer Tikka Rice Bowl',
      cuisine: 'rice good street',
      rating: 0,
      time: '20 Mins',
      price: '₹200',
      image: '/landing/3.jpg'
    },
    {
      id: 4,
      name: 'Aloo Paratha Curd Meal (2 Pcs)',
      cuisine: 'restaurant',
      rating: 0,
      time: '25 Mins',
      price: '₹98',
      image: '/landing/4.jpg'
    },
    {
      id: 5,
      name: 'Swapp - Diet Meal Box',
      cuisine: 'healthy nuts salads',
      rating: 4.5,
      time: '40 Mins',
      price: '300 for two',
      image: '/landing/5.jpg'
    },
    {
      id: 6,
      name: 'The Good Bowl - Traditional Bowls',
      cuisine: 'south indian punjabi',
      rating: 4.5,
      time: '25 Mins',
      price: '250 for two',
      image: '/landing/6.jpg'
    },
    {
      id: 7,
      name: 'Baked Pizza Wrap - Vegetarian',
      cuisine: 'Italian - wraps & rolls',
      rating: 0,
      time: '20 Mins',
      price: '₹200',
      image: '/landing/7.jpg'
    },
    {
      id: 8,
      name: 'Mixed Veg Fried Rice With Dry Fruits',
      cuisine: 'Indo restaurant',
      rating: 0,
      time: '45 Mins',
      price: '₹80',
      image: '/landing/8.jpg'
    }
  ];

 const recommendedItems = [
  {
    id: 1,
    name: 'Jollof Rice with Grilled Chicken',
    restaurant: 'Mama Nkechi Kitchen',
    price: '₦2,500',
    time: '30 Mins',
    rating: 4.6,
    image: '/categories/jollof.jpg'
  },
  {
    id: 2,
    name: 'Suya with Onions & Pepper',
    restaurant: 'Abuja Suya Spot',
    price: '₦1,800',
    time: '20 Mins',
    rating: 4.5,
    image: '/categories/suya.jpg'
  },
  {
    id: 3,
    name: 'Pounded Yam & Egusi Soup',
    restaurant: 'Yam & Egusi Corner',
    price: '₦2,700',
    time: '35 Mins',
    rating: 4.4,
    image: '/landing/pounded-yam-egusi.jpg'
  },
  {
    id: 4,
    name: 'Pepper Soup (Catfish)',
    restaurant: 'Pepper Soup Palace',
    price: '₦3,000',
    time: '25 Mins',
    rating: 4.3,
    image: '/categories/pepper-soup.jpg'
  }
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
    <main className="min-h-screen bg-card">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Nearby Restaurants */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nearby Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-[#2d5f4f]/30 transition-all cursor-pointer group"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-card rounded-full shadow-md hover:bg-gray-100">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 capitalize">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      {restaurant.rating > 0 && (
                        <>
                          <Star className="w-4 h-4 text-green-600 fill-green-600" />
                          <span className="font-medium text-gray-900">{restaurant.rating}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.time}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{restaurant.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Let's Do It Together Section */}
     <LetsDoItTogether />

      {/* What's on your mind */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What's on your mind?</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-center cursor-pointer group"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-4 border-white shadow-lg group-hover:border-[#2d5f4f] transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Personalized recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-[#2d5f4f]/30 transition-all cursor-pointer group"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{item.restaurant}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.rating > 0 && (
                        <>
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                        </>
                      )}
                      <span className="text-sm font-bold text-gray-900">{item.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#2d5f4f]" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2d5f4f] to-[#3d7f6f] py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="4"/>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3"/>
                    <path d="M100 50 L85 95 L105 95 L90 140 L115 95 L95 95 Z" fill="white"/>
                    <path d="M140 40 L140 80 M130 40 L130 75 Q130 85 140 85 M150 40 L150 75 Q150 85 140 85" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">oyaeat</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">About us</h4>
            </div>
            <div>
              <h4 className="font-bold mb-4">Delivery</h4>
            </div>
            <div>
              <h4 className="font-bold mb-4">Help & Support</h4>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/20 pt-6">
            <div className="flex items-center gap-2">
              <span>Contact : +91-1234567890</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity">Facebook</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Instagram</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Twitter</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes carouselSlide {
          0% {
            transform: translateX(0);
            opacity: 1;
            scale: 0.85;
          }
          25% {
            transform: translateX(0);
            opacity: 1;
            scale: 1;
          }
          50% {
            transform: translateX(-100%);
            opacity: 1;
            scale: 0.85;
          }
          75% {
            transform: translateX(-100%);
            opacity: 1;
            scale: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
            scale: 0.85;
          }
        }

        @keyframes indicatorPulse {
          0%, 16.66% {
            background-color: #2d5f4f;
            scale: 1;
          }
          16.67%, 100% {
            background-color: #d1d5db;
            scale: 0.8;
          }
        }

        .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-slide {
          position: absolute;
          width: 300px;
          height: 100%;
          animation: carouselSlide 12s infinite ease-in-out;
        }

        .carousel-slide:nth-child(1) {
          animation-delay: 0s;
        }

        .carousel-slide:nth-child(2) {
          animation-delay: -2s;
        }

        .carousel-slide:nth-child(3) {
          animation-delay: -4s;
        }

        .carousel-slide:nth-child(4) {
          animation-delay: -6s;
        }

        .carousel-slide:nth-child(5) {
          animation-delay: -8s;
        }

        .carousel-slide:nth-child(6) {
          animation-delay: -10s;
        }

        .indicator-dot {
          animation: indicatorPulse 12s infinite ease-in-out;
        }

        .indicator-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .indicator-dot:nth-child(2) {
          animation-delay: -2s;
        }

        .indicator-dot:nth-child(3) {
          animation-delay: -4s;
        }

        .indicator-dot:nth-child(4) {
          animation-delay: -6s;
        }

        .indicator-dot:nth-child(5) {
          animation-delay: -8s;
        }

        .indicator-dot:nth-child(6) {
          animation-delay: -10s;
        }
      `}</style>
    </main>
  );
}
