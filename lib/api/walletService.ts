const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Helper to grab authorization headers safely
const getAuthHeaders = (tokenKey: "authToken" | "riderToken" | "adminToken" = "authToken") => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
});

export const walletApi = {
   // ── FOR VENDORS & RIDERS ──
  getWalletSummary: async (roleType: "authToken" | "riderToken") => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/summary`, {
      headers: getAuthHeaders(roleType),
    });
    if (!res.ok) throw new Error("Failed to load user financial ledger balance parameters");
    
    const payload = await res.json();
    
    
    // This strips away { success: true } and hands your page component exactly what it expects!
    return payload.data; 
  },


  // Fire a new withdrawal request into the admin wire queue
  submitWithdrawal: async (amount: number, roleType: "authToken" | "riderToken") => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/request-payout`, {
      method: "POST",
      headers: getAuthHeaders(roleType),
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Withdrawal request rejected by engine");
    return data;
  },

  // ── FOR SUPER-ADMINS ONLY ──
  // Link manual bank accounts extracted from secure support emails
  linkBankFromEmail: async (formData: { userEmail: string; userType: string; bankName: string; accountNumber: string; accountName: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/admin/onboard-bank`, {
      method: "POST",
      headers: getAuthHeaders("authToken"), // Assumes admin token is stored here or dedicated key
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to commit manual banking binding row");
    return data;
  },

  // Mark a pending withdrawal row as paid after completing a real wire transfer
  confirmPayoutCompleted: async (transactionId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/admin/resolve-payout/${transactionId}`, {
      method: "PUT",
      headers: getAuthHeaders("authToken"),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to confirm payout settlement");
    return data;
  }
};
