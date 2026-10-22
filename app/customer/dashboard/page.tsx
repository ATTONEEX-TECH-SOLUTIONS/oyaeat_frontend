import { redirect } from "next/navigation";

// The signed-in home is the same feed as the public one.
export default async function CustomerDashboardIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  redirect(q ? `/customer?q=${encodeURIComponent(q)}` : "/customer");
}
