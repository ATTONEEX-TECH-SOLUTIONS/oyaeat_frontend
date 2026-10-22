"use client";

import { PageHeader as Header } from "@/components/shared/states";

export function PageHeader() {
  return (
    <Header
      title="Business approvals"
      subtitle="Review new registrations, then approve, reject or suspend."
    />
  );
}
