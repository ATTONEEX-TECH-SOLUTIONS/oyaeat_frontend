import { Suspense } from "react";
import HomeView from "@/components/customer/HomeView";

export default function CustomerHomePage() {
  return (
    <Suspense>
      <HomeView />
    </Suspense>
  );
}
