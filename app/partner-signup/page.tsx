"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/spalsh_oyaeat (3).png";
import chefImage from "@/public/vendor.png";

const PartnerSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessType: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual API base URL
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          businessType: formData.businessType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store registration data including userId for next steps
      sessionStorage.setItem("partnerSignupData", JSON.stringify({
        ...formData,
        userId: data.userId || data.id || data.user?.id, // Adjust based on your API response structure
      }));
      
      // Navigate to phone verification
      router.push("/partner-signup/verify-phone");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/restaurant/login", label: "Sign in" },
    { href: "/features", label: "Features" },
    { href: "/downloads", label: "Downloads" },
    { href: "/how-it-works", label: "How it works" },
  ];

  const solutions = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Restaurants & Food",
      description: "Reach more customers and grow your restaurant business with our delivery platform.",
      features: ["Flexible delivery options", "Menu management", "Real-time analytics"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: "Retail & Shops",
      description: "Expand your retail business online and deliver products directly to customers.",
      features: ["Wide customer reach", "Inventory tracking", "Secure payments"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Groceries & Supermarkets",
      description: "Bring your grocery store online and offer convenient shopping to your community.",
      features: ["Fast delivery", "Fresh products", "Easy ordering"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Pharmacies",
      description: "Deliver medicines and health products safely and quickly to customers in need.",
      features: ["Licensed delivery", "Prescription handling", "24/7 availability"]
    }
  ];

  const testimonials = [
    {
      name: "Chinedu Okafor",
      business: "Mama Put Restaurant, Lagos",
      avatar: (
        <svg className="w-12 h-12 text-[#2d5f4f]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      rating: 5,
      text: "Since joining OyaEat, our orders have increased by 300%! The platform is easy to use and customer support is excellent."
    },
    {
      name: "Amina Ibrahim",
      business: "Fresh Market Groceries, Abuja",
      avatar: (
        <svg className="w-12 h-12 text-[#2d5f4f]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      rating: 5,
      text: "OyaEat helped us reach customers we never could before. The delivery service is reliable and our sales have grown significantly."
    },
    {
      name: "Tunde Adeleke",
      business: "Jollof Express, Port Harcourt",
      avatar: (
        <svg className="w-12 h-12 text-[#2d5f4f]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      rating: 5,
      text: "Best decision for our business! We get daily orders and the commission structure is fair. Highly recommend to all restaurant owners."
    }
  ];

  const faqs = [
    {
      question: "How much does it cost to partner with OyaEat?",
      answer: "Registration is completely free! We only charge a small commission on each successful order. No hidden fees or upfront costs."
    },
    {
      question: "How long does the registration process take?",
      answer: "The registration process typically takes 2-3 business days. Once you submit your documents, our team will review and verify them. You'll be notified via email when your account is approved."
    },
    {
      question: "What documents do I need to register?",
      answer: "You'll need a valid business license, tax identification number (TIN), and a government-issued ID. For food businesses, we also require health and safety certifications."
    },
    {
      question: "How do I receive payments?",
      answer: "Payments are processed weekly and transferred directly to your registered bank account. You can track all your earnings in real-time through our partner dashboard."
    },
    {
      question: "Can I set my own delivery area?",
      answer: "Yes! You have full control over your delivery zones and operating hours. You can adjust these settings anytime through your partner dashboard."
    },
    {
      question: "What support do you provide to partners?",
      answer: "We provide 24/7 customer support, dedicated account managers, marketing materials, and regular training sessions to help you maximize your success on our platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-[#e8f5f1] to-[#d4ebe5]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            {/* <div className="relative w-26 h-26 transition-transform duration-300 group-hover:scale-110">
              <Image
                src={logo}
                alt="OyaEat Logo"
                fill
                className="object-contain"
                priority
              />
            </div> */}
            <div className="flex flex-col">
              <span className="text-3xl font-black leading-none tracking-tight">
                <span className="text-[#2d5f4f]">Oya</span>
                <span className="text-gray-900">Eat</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-gray-600">
                Fast Delivery
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-bold text-base text-gray-900 hover:text-[#2d5f4f] transition-all duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-1 bg-[#2d5f4f] rounded-full transition-all duration-300 ease-out w-0 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button className="lg:hidden text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row pt-20">
        <div className="lg:w-1/2 w-full px-6 lg:px-16 py-12 lg:py-20 flex items-center">
          <div className="w-full max-w-xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Build your business<br />online with OyaEat
            </h1>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start selling through OyaEat
              </h2>
              <p className="text-gray-700 mb-8">
                Registering on OyaEat has never been easier. Become a partner now.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-900 placeholder-gray-600 transition-all"
                  placeholder="First name *"
                  required
                  disabled={isLoading}
                />

                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-900 placeholder-gray-600 transition-all"
                  placeholder="Last name *"
                  required
                  disabled={isLoading}
                />

                <select
                  value={formData.businessType}
                  onChange={(e) => updateFormData("businessType", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-700 transition-all"
                  required
                  disabled={isLoading}
                >
                  <option value="">Business type *</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="fastfood">Fast Food</option>
                  <option value="cafe">Café</option>
                  <option value="bakery">Bakery</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-900 placeholder-gray-600 transition-all"
                  placeholder="Email *"
                  required
                  disabled={isLoading}
                />

                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-900 placeholder-gray-600 transition-all"
                  placeholder="Phone number *"
                  required
                  disabled={isLoading}
                />

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="w-full px-4 py-3 bg-white backdrop-blur-sm border border-white/40 rounded-lg  outline-none text-gray-900 placeholder-gray-600 transition-all"
                  placeholder="Password *"
                  required
                  minLength={8}
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your account...
                    </span>
                  ) : (
                    "Get Started"
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-[#2d5f4f] hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#2d5f4f] hover:underline font-medium">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full relative min-h-[400px] lg:min-h-screen overflow-hidden">
          <div className="absolute top-0 left-0 w-24 lg:w-32 h-full bg-[#FDB750] -skew-x-12 transform origin-top-left"></div>
          <div className="absolute bottom-0 right-0 w-24 lg:w-32 h-full bg-[#FDB750] -skew-x-12 transform origin-bottom-right"></div>
          
          <div className="relative h-full flex items-center justify-center p-8 lg:p-16">
            <div className="relative w-full max-w-lg aspect-square">
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
                <path
                  d="M 250,50 C 350,50 450,150 450,250 C 450,300 430,345 395,380 C 360,415 315,440 265,450 C 215,460 165,460 115,450 C 65,440 30,415 15,370 C 0,325 0,275 15,225 C 30,175 65,125 115,90 C 165,55 200,50 250,50 Z"
                  fill="#c8574a"
                  opacity="0.2"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[85%] h-[85%]">
                  <Image
                    src={chefImage}
                    alt="Partner chef"
                    fill
                    className="object-cover rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find the Best Solution Section */}
      <section className="py-20 px-6 bg-[#2d5f4f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Find the best solution for your business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whatever your business type, we have the perfect solution to help you grow and reach more customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-[#2d5f4f] mb-6">{solution.icon}</div>
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

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What our partners say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful businesses already growing with OyaEat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#2d5f4f] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#e8f5f1] to-[#d4ebe5] rounded-full flex items-center justify-center mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-white">{testimonial.business}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#FDB750]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-white italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-[#2d5f4f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-900">
              Got questions? We've got answers
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-[#2d5f4f] transform transition-transform flex-shrink-0 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-5 bg-white border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src={logo}
                    alt="OyaEat Logo"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <span className="text-2xl font-black">
                  <span className="text-[#2d5f4f]">Oya</span>Eat
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Nigeria's fastest growing food delivery platform. Connecting customers with their favorite restaurants.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#2d5f4f] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#2d5f4f] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#2d5f4f] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">For Partners</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Registration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>partners@oyaeat.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+234 800 123 4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Business Avenue, Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 OyaEat. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartnerSignup;