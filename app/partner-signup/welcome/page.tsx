"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Building2, FileCheck2 } from "lucide-react";
import FlowShell from "@/components/partner-signup/FlowShell";
import { PrimaryButton } from "@/components/partner-signup/ui";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <FlowShell
      step={3}
      eyebrow="Phone verified"
      title="You're in. Two more things to do."
      subtitle="Here's what we need from you to get your restaurant reviewed and live."
    >
      <ol className="space-y-3">
        <li className="flex items-start gap-4 rounded-2xl bg-violet-50 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></span>
          <div>
            <p className="font-bold">Add your business</p>
            <p className="text-sm text-muted-foreground">Name, contact details and where you&apos;re located (about 2 minutes).</p>
          </div>
        </li>
        <li className="flex items-start gap-4 rounded-2xl bg-violet-50 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><FileCheck2 className="h-5 w-5" /></span>
          <div>
            <p className="font-bold">Upload your documents</p>
            <p className="text-sm text-muted-foreground">CAC certificate, tax ID, food permit, owner ID and bank proof. Have them ready as PDF or image files (5MB max each).</p>
          </div>
        </li>
      </ol>
      <PrimaryButton onClick={() => router.push("/partner-signup/add-business")} className="mt-6 w-full sm:w-auto">
        Add my business <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </FlowShell>
  );
}
