import VendorShell from "@/components/restaurant/VendorShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorShell>{children}</VendorShell>;
}
