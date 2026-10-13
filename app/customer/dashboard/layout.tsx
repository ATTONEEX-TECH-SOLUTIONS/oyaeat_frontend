// The customer shell (app/customer/layout.tsx) provides navigation and the auth guard.
export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
