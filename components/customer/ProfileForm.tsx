"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, type CustomerUser } from "@/lib/customer";

const field =
  "h-11 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60";

/** Edit name / phone, and optionally change the password. Saved to the account. */
export default function ProfileForm({ user, onSaved }: { user: CustomerUser; onSaved: (u: CustomerUser) => void }) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const changingPassword = !!newPassword || !!currentPassword;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) return setError("Enter your first and last name.");
    if (changingPassword && (!currentPassword || newPassword.length < 6)) {
      return setError("To change your password, enter the current one and a new one of at least 6 characters.");
    }
    setSaving(true);
    try {
      const body: Record<string, string> = { firstName, lastName, phone };
      if (changingPassword) Object.assign(body, { currentPassword, newPassword });
      const json = await api("/customer/auth/me", { method: "PATCH", auth: true, body: JSON.stringify(body) });
      const next = { ...user, ...json.data.user };
      localStorage.setItem("customer_user", JSON.stringify(next));
      onSaved(next);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated");
    } catch (err: any) {
      setError(err.message || "Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <h2 className="font-display text-lg font-bold">Your details</h2>
      {error && (
        <div role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-first" className="mb-1.5 block text-sm font-semibold">First name</label>
          <input id="pf-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={field} disabled={saving} />
        </div>
        <div>
          <label htmlFor="pf-last" className="mb-1.5 block text-sm font-semibold">Last name</label>
          <input id="pf-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={field} disabled={saving} />
        </div>
      </div>
      <div>
        <label htmlFor="pf-phone" className="mb-1.5 block text-sm font-semibold">Phone</label>
        <input id="pf-phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} disabled={saving} />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-semibold">Email</p>
        <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">{user.email} <span className="text-xs">(can&apos;t be changed)</span></p>
      </div>

      <fieldset className="space-y-3 rounded-2xl bg-violet-50 p-4">
        <legend className="px-1 text-sm font-bold">Change password (optional)</legend>
        <input type="password" autoComplete="current-password" placeholder="Current password" aria-label="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={field} disabled={saving} />
        <input type="password" autoComplete="new-password" placeholder="New password (6+ characters)" aria-label="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={field} disabled={saving} />
      </fieldset>

      <button type="submit" disabled={saving} className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-violet-800 disabled:opacity-60">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
      </button>
    </form>
  );
}
