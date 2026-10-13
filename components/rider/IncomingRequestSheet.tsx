"use client";

import { BellRing, Loader2, MapPin, Navigation, Store } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useRider } from "./RiderProvider";

const naira = (n: number) => `₦${Math.round(Number(n) || 0).toLocaleString()}`;

/** A new order offer. Shows on any screen while the rider is online. */
export default function IncomingRequestSheet() {
  const { incoming, dismissIncoming, accept, busy } = useRider();
  return (
    <Dialog open={!!incoming} onOpenChange={(o) => !o && dismissIncoming()}>
      <DialogContent className="max-w-sm rounded-3xl p-0 sm:max-w-sm" aria-describedby="offer-desc">
        {incoming && (
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cta text-cta-foreground"><BellRing className="h-8 w-8" /></span>
              <DialogTitle className="font-display mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">New order nearby</DialogTitle>
              <p className="font-display mt-1 text-4xl font-extrabold tracking-tight text-primary">{naira(incoming.payout)}</p>
              <p className="text-sm text-muted-foreground">Estimated earnings</p>
              <DialogDescription id="offer-desc" className="sr-only">Accept or decline this delivery request.</DialogDescription>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-violet-50 p-4 text-sm">
              <p className="flex items-start gap-3"><Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><b className="block">{incoming.restaurantName}</b><span className="text-muted-foreground">{incoming.distance} from you</span></span></p>
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{incoming.dropoffAddress}</span></p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={dismissIncoming} className="h-14 rounded-full border border-border text-base font-bold transition hover:bg-violet-50">Decline</button>
              <button
                disabled={busy}
                onClick={async () => {
                  const id = incoming.orderId;
                  dismissIncoming();
                  await accept(id);
                }}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Navigation className="h-5 w-5" /> Accept</>}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
