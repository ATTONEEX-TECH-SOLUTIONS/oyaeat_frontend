import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roles = [
  ["Customer", "/customer/login"],
  ["Rider", "/rider/login"],
  ["Restaurant partner", "/restaurant/login"],
] as const;

export default function LoginPickerPage() {
  return (
    <main className="flex min-h-screen items-center bg-[var(--oya-surface-50)] p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-h1">Sign in to OyaEat</CardTitle>
          <p className="text-body text-[var(--oya-ink-600)]">
            Choose your account type.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map(([role, href]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-md border border-[var(--oya-border)] p-4 text-h2 transition-colors hover:bg-[var(--oya-surface-100)]"
            >
              {role}
            </Link>
          ))}
          <Link
            href="/"
            className="block text-center text-label text-[var(--oya-green-700)] underline"
          >
            Back to homepage
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
