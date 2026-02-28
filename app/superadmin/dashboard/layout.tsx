import type { ReactNode } from "react";

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* later you can add sidebar/topbar here */}
      {children}
    </div>
  );
}