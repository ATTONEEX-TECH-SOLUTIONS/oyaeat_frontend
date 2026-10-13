"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, MessageSquare, ShieldAlert } from "lucide-react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Alert = { id: number; title: string; desc: string; type: string; createdAt: string };

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch(`${API}/chat/operations-alerts`, { headers: { Authorization: `Bearer ${localStorage.getItem("riderToken")}` } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || "We couldn't load your alerts.");
      setAlerts(json.data || []);
    } catch (e: any) {
      setError(e?.message || "We couldn't load your alerts.");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (error) return <ErrorState title="We couldn't load alerts" message={error} onRetry={load} />;
  if (!alerts) return <div className="space-y-3" aria-busy="true">{[0, 1].map((i) => <Skeleton key={i} className="h-20 rounded-2xl bg-muted" />)}</div>;
  if (alerts.length === 0) return <EmptyState icon={Bell} title="No alerts" body="Messages from the OyaEat operations team will appear here." />;

  return (
    <ul className="space-y-3">
      {alerts.map((a) => {
        const warn = a.type === "warning";
        return (
          <li key={a.id} className={cn("flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-card", warn ? "border-destructive/30" : "border-border")}>
            <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", warn ? "bg-destructive/10 text-destructive" : "bg-violet-100 text-violet-700")}>
              {warn ? <ShieldAlert className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <p className="font-bold">{a.title}</p>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{a.createdAt ? formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) : "Just now"}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function RiderSupportPage() {
  const [tab, setTab] = useState<"support" | "alerts">("support");
  return (
    <div className="mx-auto flex h-[calc(100dvh-13rem)] max-w-4xl flex-col lg:h-[calc(100dvh-9.5rem)]">
      <PageHeader title="Support" subtitle="Chat with the team or read operations alerts." />
      <div role="tablist" className="mb-4 inline-flex w-fit rounded-full bg-violet-50 p-1">
        {([["support", "Chat", MessageSquare], ["alerts", "Alerts", Bell]] as const).map(([key, label, Icon]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={cn("flex h-10 items-center gap-2 rounded-full px-5 text-sm font-bold transition", tab === key ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{tab === "support" ? <ChatInterface role="rider" /> : <Alerts />}</div>
    </div>
  );
}
