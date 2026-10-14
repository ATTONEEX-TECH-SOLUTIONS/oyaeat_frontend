import Logo from "@/components/brand/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const LOGIN_BY_ROLE: Record<string, string> = {
  customer: "/customer/login",
  owner: "/restaurant/login",
  restaurant: "/restaurant/login",
  rider: "/rider/login",
  admin: "/superadmin/login",
};

export const loginFor = (role?: string | null) => LOGIN_BY_ROLE[String(role || "").toLowerCase()] || "/login";

export const recoveryField =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60";

/** One calm card used by forgot / reset password for every role. */
export default function RecoveryShell({
  title,
  subtitle,
  backHref,
  backLabel = "Back to log in",
  children,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <Logo className="mb-6 h-14" />
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <Link href={backHref} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      </div>
    </main>
  );
}
