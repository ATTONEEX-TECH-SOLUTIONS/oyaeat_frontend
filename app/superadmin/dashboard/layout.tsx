import { ToastProvider } from "@/components/ui/toast-provider";
import AdminShell from "@/components/superadmin/AdminShell";
import type { ReactNode } from "react";

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
