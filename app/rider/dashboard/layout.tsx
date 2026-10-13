import RiderShell from "@/components/rider/RiderShell";

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RiderShell>{children}</RiderShell>;
}
