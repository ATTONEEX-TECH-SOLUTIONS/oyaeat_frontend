import { ReactNode } from "react";

export interface SolutionItem {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface TestimonialItem {
  name: string;
  business: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const solutions = [
  {
    icon: "shopping-cart",
    title: "Restaurants & Food",
    description: "Reach more customers and grow your restaurant business with our delivery platform.",
    features: ["Flexible delivery options", "Menu management", "Real-time analytics"]
  },
  {
    icon: "shopping-bag",
    title: "Retail & Shops",
    description: "Expand your retail business online and deliver products directly to customers.",
    features: ["Wide customer reach", "Inventory tracking", "Secure payments"]
  },
  {
    icon: "store",
    title: "Groceries & Supermarkets",
    description: "Bring your grocery store online and offer convenient shopping to your community.",
    features: ["Fast delivery", "Fresh products", "Easy ordering"]
  },
  {
    icon: "heart-pulse",
    title: "Pharmacies",
    description: "Deliver medicines and health products safely and quickly to customers in need.",
    features: ["Licensed delivery", "Prescription handling", "24/7 availability"]
  }
];

export const testimonials = [
  {
    name: "Chinedu Okafor",
    business: "Mama Put Restaurant, Lagos",
    avatar: "user",
    rating: 5,
    text: "Since joining OyaEat, our orders have increased by 300%! The platform is easy to use and customer support is excellent."
  },
  {
    name: "Amina Ibrahim",
    business: "Fresh Market Groceries, Abuja",
    avatar: "user",
    rating: 5,
    text: "OyaEat helped us reach customers we never could before. The delivery service is reliable and our sales have grown significantly."
  },
  {
    name: "Tunde Adeleke",
    business: "Jollof Express, Port Harcourt",
    avatar: "user",
    rating: 5,
    text: "Best decision for our business! We get daily orders and the commission structure is fair. Highly recommend to all restaurant owners."
  }
];

export const faqs = [
  { question: "How much does it cost to partner with OyaEat?", answer: "Registration is completely free! We only charge a small commission on each successful order. No hidden fees or upfront costs." },
  { question: "How long does the registration process take?", answer: "The registration process typically takes 2-3 business days. Once you submit your documents, our team will review and verify them. You'll be notified via email when your account is approved." },
  { question: "What documents do I need to register?", answer: "You'll need a valid business license, tax identification number (TIN), and a government-issued ID. For food businesses, we also require health and safety certifications." },
  { question: "How do I receive payments?", answer: "Payments are processed weekly and transferred directly to your registered bank account. You can track all your earnings in real-time through our partner dashboard." },
  { question: "Can I set my own delivery area?", answer: "Yes! You have full control over your delivery zones and operating hours. You can adjust these settings anytime through your partner dashboard." },
  { question: "What support do you provide to partners?", answer: "We provide 24/7 customer support, dedicated account managers, marketing materials, and regular training sessions to help you maximize your success on our platform." }
];
