import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import Categories from "@/components/landing-page/Categories";
import NearbyRestaurants from "@/components/landing-page/NearbyRestaurants";
import HowItWorks from "@/components/landing-page/HowItWorks";
import PersonalizedRecommendations from "@/components/landing-page/PersonalizedRecommendations";
import LetsDoItTogether from "@/components/landing-page/LetsDoItTogether";
import DownloadBand from "@/components/landing-page/DownloadBand";
import Footer from "@/components/landing-page/Footer";
import {
  categories,
  nearbyRestaurants,
  recommendedItems,
} from "@/components/landing-page/data";

export default function Home() {
  return (
    <div className="landing min-h-screen overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <Categories data={categories} />
        <HowItWorks />
        <NearbyRestaurants data={nearbyRestaurants} />
        <PersonalizedRecommendations data={recommendedItems} />
        <LetsDoItTogether />
        <DownloadBand />
      </main>
      <Footer />
    </div>
  );
}
