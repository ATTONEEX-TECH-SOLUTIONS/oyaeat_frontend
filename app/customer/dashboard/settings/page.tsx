"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart, LifeBuoy, LogOut, Mail, Phone, Receipt } from "lucide-react";
import { PageHeader } from "@/components/customer/ui";
import ProfileForm from "@/components/customer/ProfileForm";
import AddressBook from "@/components/customer/AddressBook";
import { clearSession, getUser, type CustomerUser } from "@/lib/customer";

const LINKS = [
  { href: "/customer/dashboard/orders", label: "My orders", hint: "Track and reorder", icon: Receipt },
  { href: "/customer/dashboard/favorites", label: "Saved restaurants", hint: "Your favourite kitchens", icon: Heart },
  { href: "/customer/dashboard/support", label: "Help & support", hint: "Chat with the OyaEat team", icon: LifeBuoy },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => setUser(getUser()), []);
  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Account" />

      <section className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-card sm:p-6">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-cta font-display text-2xl font-extrabold text-cta-foreground">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="font-display truncate text-xl font-extrabold">
            {user.firstName} {user.lastName}
          </p>
          {user.email && (
            <p className="mt-1 flex items-center gap-2 truncate text-sm text-violet-100">
              <Mail className="h-4 w-4 shrink-0" /> {user.email}
            </p>
          )}
          {user.phone && (
            <p className="mt-0.5 flex items-center gap-2 text-sm text-violet-100">
              <Phone className="h-4 w-4 shrink-0" /> {user.phone}
            </p>
          )}
        </div>
      </section>

      <div className="mt-5 space-y-5">
        <ProfileForm user={user} onSaved={setUser} />
        <AddressBook />
      </div>

      <ul className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex items-center gap-4 p-4 transition hover:bg-violet-50/60">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-800">
                <l.icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">{l.label}</span>
                <span className="block text-sm text-muted-foreground">{l.hint}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          clearSession();
          router.push("/customer/login");
        }}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-destructive/30 text-sm font-bold text-destructive transition hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}
