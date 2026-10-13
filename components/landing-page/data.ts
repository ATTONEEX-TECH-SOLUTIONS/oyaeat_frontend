// Display data for the public landing page. These are demo values, not live
// endpoints - swap for API calls when discovery is wired to the backend.

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  price: string;
  image: string;
  isPopular?: boolean;
}

export interface RecommendationItem {
  id: number;
  name: string;
  restaurant: string;
  price: string;
  time: string;
  rating: number;
  image: string;
}

export interface Category {
  name: string;
  image: string;
}

export const nearbyRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Iyan Alata - Pounded Yam Hub",
    cuisine: "Local Swallows & Soups",
    rating: 4.8,
    time: "25 min",
    price: "₦4,500 for two",
    image: "/landing/opt/9.webp",
    isPopular: true,
  },
  {
    id: 2,
    name: "Kilimanjaro Express",
    cuisine: "Naija Delicacies",
    rating: 4.2,
    time: "30 min",
    price: "₦5,000 for two",
    image: "/landing/opt/2.webp",
  },
  {
    id: 3,
    name: "The Asun & Grill Joint",
    cuisine: "Street Food & Grills",
    rating: 4.5,
    time: "20 min",
    price: "₦3,500 for two",
    image: "/landing/opt/3.webp",
  },
  {
    id: 4,
    name: "Mega Chicken Fast Food",
    cuisine: "Continental & Local",
    rating: 4.0,
    time: "25 min",
    price: "₦6,000 for two",
    image: "/landing/opt/4.webp",
  },
  {
    id: 5,
    name: "Green Grill - Healthy Bowls",
    cuisine: "Salads & Healthy Sides",
    rating: 4.5,
    time: "40 min",
    price: "₦7,000 for two",
    image: "/landing/opt/5.webp",
  },
  {
    id: 6,
    name: "The Place Restaurant",
    cuisine: "Rice Meals & Combos",
    rating: 4.6,
    time: "25 min",
    price: "₦4,000 for two",
    image: "/landing/opt/6.webp",
  },
  {
    id: 7,
    name: "Gidi Pizza & Shawarma Hub",
    cuisine: "Pastries & Fast Food",
    rating: 4.1,
    time: "20 min",
    price: "₦5,500 for two",
    image: "/landing/opt/7.webp",
  },
  {
    id: 8,
    name: "Calabar Kitchen Delights",
    cuisine: "Edikang Ikong & Soups",
    rating: 4.9,
    time: "45 min",
    price: "₦8,000 for two",
    image: "/landing/opt/8.webp",
    isPopular: true,
  },
];

export const recommendedItems: RecommendationItem[] = [
  {
    id: 1,
    name: "Jollof Rice with Grilled Chicken",
    restaurant: "Mama Nkechi Kitchen",
    price: "₦2,500",
    time: "30 min",
    rating: 4.6,
    image: "/landing/opt/jollof.webp",
  },
  {
    id: 2,
    name: "Suya with Onions & Pepper",
    restaurant: "Abuja Suya Spot",
    price: "₦1,800",
    time: "20 min",
    rating: 4.5,
    image: "/landing/opt/suya.webp",
  },
  {
    id: 3,
    name: "Pounded Yam & Egusi Soup",
    restaurant: "Yam & Egusi Corner",
    price: "₦2,700",
    time: "35 min",
    rating: 4.4,
    image: "/landing/opt/pounded-yam-egusi.webp",
  },
  {
    id: 4,
    name: "Pepper Soup (Catfish)",
    restaurant: "Pepper Soup Palace",
    price: "₦3,000",
    time: "25 min",
    rating: 4.3,
    image: "/landing/opt/pepper-soup.webp",
  },
];

export const categories: Category[] = [
  { name: "Ofada Rice", image: "/landing/opt/ofada.webp" },
  { name: "Amala & Ewedu", image: "/landing/opt/amala.webp" },
  { name: "Jollof", image: "/landing/opt/jollof.webp" },
  { name: "Akara & Puff", image: "/landing/opt/puff.webp" },
  { name: "Suya & Small Chops", image: "/landing/opt/suya.webp" },
  { name: "Grilled Chicken", image: "/landing/opt/grilled-chicken.webp" },
];
