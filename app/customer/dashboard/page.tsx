'use client';
import { Suspense} from "react"
import {DashboardContent} from "./components/dashbaord/dashboard-content"





export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-bold bg-gray-50">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
