const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Helper to grab authorization headers safely
const getAuthHeaders = (
  tokenKey: "authToken" | "riderToken" | "admin_token" = "authToken",
) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
});

// Superadmin requests use the admin token only, and send an expired or missing session back to the login page.
async function adminRequest(path: string, init: RequestInit, fallback: string) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: getAuthHeaders("admin_token") });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    if (typeof window !== "undefined") window.location.href = "/superadmin/login";
    throw new Error("Your admin session has expired. Please log in again.");
  }
  if (!res.ok) throw new Error(data.message || fallback);
  return data;
}

export type PaymentAccount = {
  bankName: string;
  bankCode: string | null;
  accountName: string;
  accountNumber: string;
  commissionPercent: number | null;
  subaccountCode: string | null;
  active: boolean;
};
export type PaymentAccountRow = {
  businessId: number;
  name: string;
  city?: string | null;
  email?: string | null;
  account: PaymentAccount | null;
  submittedBank: { bankName: string; accountNumber: string; accountName: string } | null;
};

export const paymentAccountsApi = {
  list: async (): Promise<PaymentAccountRow[]> =>
    (await adminRequest("/admin/payment-accounts", {}, "Couldn't load restaurants")).data,
  banks: async (): Promise<{ name: string; code: string }[]> =>
    (await adminRequest("/admin/banks", {}, "Couldn't load the bank list")).data,
  resolve: async (accountNumber: string, bankCode: string): Promise<{ accountName: string }> =>
    (
      await adminRequest(
        "/admin/payment-accounts/resolve",
        { method: "POST", body: JSON.stringify({ accountNumber, bankCode }) },
        "Couldn't verify that account",
      )
    ).data,
  save: async (
    businessId: number,
    body: { bankCode: string; bankName: string; accountNumber: string; commissionPercent: number | null },
  ): Promise<PaymentAccount> =>
    (
      await adminRequest(
        `/admin/businesses/${businessId}/payment-account`,
        { method: "PUT", body: JSON.stringify(body) },
        "Couldn't save the payment account",
      )
    ).data,
  deactivate: async (businessId: number): Promise<PaymentAccount> =>
    (
      await adminRequest(
        `/admin/businesses/${businessId}/payment-account`,
        { method: "DELETE" },
        "Couldn't deactivate the payment account",
      )
    ).data,
};

export const walletApi = {
  // ── FOR VENDORS & RIDERS ──
  getWalletSummary: async (roleType: "authToken" | "riderToken") => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/summary`, {
      headers: getAuthHeaders(roleType),
    });
    if (!res.ok)
      throw new Error(
        "Failed to load user financial ledger balance parameters",
      );

    const payload = await res.json();

    // This strips away { success: true } and hands your page component exactly what it expects!
    return payload.data;
  },

  // Fire a new withdrawal request into the admin wire queue
  submitWithdrawal: async (
    amount: number,
    roleType: "authToken" | "riderToken",
  ) => {
    const res = await fetch(`${API_BASE_URL}/api/wallet/request-payout`, {
      method: "POST",
      headers: getAuthHeaders(roleType),
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Withdrawal request rejected by engine");
    return data;
  },

  // ── FOR SUPER-ADMINS ONLY ──
  // Link manual bank accounts extracted from secure support emails
  linkBankFromEmail: async (formData: {
    userEmail: string;
    userType: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => {
    return adminRequest(
      "/api/wallet/admin/onboard-bank",
      { method: "POST", body: JSON.stringify(formData) },
      "Failed to commit manual banking binding row",
    );
  },

  // Mark a pending withdrawal row as paid after completing a real wire transfer
  confirmPayoutCompleted: async (transactionId: string) => {
    return adminRequest(
      `/api/wallet/admin/resolve-payout/${transactionId}`,
      { method: "PUT" },
      "Failed to confirm payout settlement",
    );
  },
};
