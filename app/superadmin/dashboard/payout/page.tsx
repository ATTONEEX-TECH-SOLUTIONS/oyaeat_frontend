'use client'

import { useState, useEffect } from "react";
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'; 
import MetricsSummary from "../components/payouts/MetricsSummary";
import AccountOnboarding from "../components/payouts/AccountOnboarding";
import PendingPayoutsTable from "../components/payouts/PendingPayoutsTable";
import LinkedAccountsTable from "../components/payouts/LinkedAccountsTable"; // 🌟 IMPORT NEW TABLE
import { walletApi } from "@/lib/api/walletService"; 

export default function SuperAdminPayoutsDashboard() {
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]); // 🌟 NEW STATE HOOK
  const [metrics, setMetrics] = useState({
    totalPlatformVolume: 0,
    totalAdminCommission: 0, 
    restaurantOwedPool: 0,
    riderOwedPool: 0
  });

  const loadAdminDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/admin/financial-queue-logs`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }); 
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.pendingWithdrawals || []);
        setLinkedAccounts(data.linkedAccounts || []); // 🌟 SAVE ONBOARDED PROFILES TO STATE
        setMetrics(data.globalMetrics);
      }
    } catch (err) {
      console.error("Failed to load global administrative finance matrix", err);
    }
  };

  useEffect(() => {
    loadAdminDashboardData();
  }, []);

  const handleSaveBankOnboarding = async (formData: any) => {
    setSavingOnboarding(true);
    try {
      await walletApi.linkBankFromEmail(formData);
      alert("Success! Banking records bound and synchronized securely.");
      loadAdminDashboardData(); 
    } catch (err: any) {
      alert(err.message || "Failed to link banking elements");
    } finally {
      setSavingOnboarding(false);
    }
  };

  const handleExecuteSettlement = async (transactionId: string) => {
    try {
      await walletApi.confirmPayoutCompleted(transactionId);
      alert("Payout marked as completed! Balances flushed successfully.");
      loadAdminDashboardData(); 
    } catch (err: any) {
      alert(err.message || "Failed to finalize wire resolution status");
    }
  };

  return (
    <div className="flex min-h-screen bg-card">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#f5faf6]">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a5c2a] tracking-tight">Platform Split Management</h1>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Monitor automated transactional splits and manage manual bank mappings compiled from email logs.
            </p>
          </div>

          <MetricsSummary metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AccountOnboarding onSave={handleSaveBankOnboarding} processing={savingOnboarding} />
            </div>
              
          <div className="lg:col-span-2">
            <LinkedAccountsTable accounts={linkedAccounts} />
          </div>
            
          </div>

      <div className="lg:col-span-2">
              <PendingPayoutsTable requests={requests} onApprove={handleExecuteSettlement} />
            </div>

        </div>
      </main>
    </div>
  );
}
