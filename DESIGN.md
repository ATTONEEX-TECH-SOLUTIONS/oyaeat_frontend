# OyaEat design system (violet + mango)

One system for the public site, customer app, restaurant, rider and superadmin dashboards.
Tokens live in `app/globals.css` (`:root`, `.dark`, `@theme inline`). Never hardcode hex in new code;
use the semantic Tailwind classes below.

## Color roles
| Role | Token / class | Hex | Use |
|---|---|---|---|
| Brand / structure | `primary`, `violet-700` | `#5b21b6` | headings accents, primary buttons, links, selected tabs, focus |
| Deep violet | `sidebar`, `violet-900` | `#2a1156` | sidebars, hero bands, dark surfaces |
| Soft violet | `accent` (hover/selected surface), `secondary`, `muted`, `violet-50/100` | `#f1ebff` | tinted cards, hover, chips |
| Mango (action) | `cta` / `cta-foreground`, `mango-400` | `#fdba2d` | THE one key action per screen (Order now, Accept, Pay), promos, ratings, active sidebar marker |
| Mango deep | `mango-600/700` | `#d97f06` | mango text on light backgrounds (contrast safe) |
| Cream | `cream`, `mango-50/100` | `#fff4d6` | warm section backgrounds, warning chips |
| Ink | `foreground` / `muted-foreground` | `#1a1033` / `#6b6480` | text |
| Success | `success`, `success-soft` | `#15803d` | delivered / approved / online ONLY. Green is status, not brand |
| Danger | `destructive` | `#c8372d` | errors, reject, cancel |

## Rules
1. Violet is the default. Mango is scarce: at most one mango button per view, plus ratings/promo badges.
2. Mango buttons use `bg-cta text-cta-foreground`; text on mango is always dark ink, never white. `accent` is NOT mango: it is the soft violet hover surface shadcn components rely on.
3. Green means success status only. Never use it for brand, buttons or navigation.
4. Headings use `font-display` (Baloo 2); body uses Geist. Radius `rounded-xl` for cards, `rounded-full` for pills/CTAs.
5. Every list/table screen needs a loading skeleton, an empty state and an error state.
6. Cards use `shadow-card`; popovers/menus use `shadow-pop`. No flat bordered-only layouts on dashboards.
7. Keep the same sidebar pattern across roles: deep violet sidebar, mango active marker, cream/violet-50 content area.

## Rollout order
1. Foundation (tokens, palette remap): done.
2. Shared components (`components/ui`: button, badge, card, table, tabs, stat-card, empty-state, skeleton).
3. Public pages: About, Features, How it works, Careers.
4. Customer app, then Restaurant, Rider, Superadmin, Partner signup.

## Customer app patterns (done)
- One shell (`components/customer/CustomerShell.tsx`): sticky top bar (logo, location, search, cart total, account) on all sizes,
  plus a 5-tab bottom bar on mobile (Home, Orders, Cart, Saved, Account). No sidebar. Auth guard lives here.
- One cart (`hooks/useCart.ts`), one restaurant view, one cart view: the `/customer/*` and `/customer/dashboard/*` routes render the same components.
- Every data screen has skeleton, empty (`EmptyState`) and error-with-retry (`ErrorState`) states: `components/customer/ui.tsx`.
- Home hierarchy: greeting, live order, promos, cuisine filter, order again, restaurants.
- Never show data the API did not send (no invented ratings, fees or rider details).

## Superadmin patterns (done)
- One shell in `app/superadmin/dashboard/layout.tsx` (`components/superadmin/AdminShell.tsx`): grouped deep-violet sidebar with a mango active marker and a live pending-approvals badge; on mobile a top bar with a slide-over drawer. It also owns the auth guard. Pages must NOT render their own sidebar or page padding.
- Shared pieces: `components/superadmin/ui.tsx` (AdminStat, Panel, Badge, OrderBadge) and `components/shared/states.tsx` (PageHeader, EmptyState, ErrorState, TableSkeleton).
- Tables become stacked cards below `md`. The primary action in a view (Approve, Save) is the single mango button.
- Admin pages read only `admin_token`; never fall back to another role's token.

## Restaurant (vendor) patterns (done)
- One shell (`components/restaurant/VendorShell.tsx`): sidebar on desktop; on mobile a top bar plus a bottom tab bar (Dashboard, Orders, Menu, Wallet, More). Owns the auth guard and the global new-order polling, sound and badge. Pages must not play their own order alerts.
- Orders is a kitchen view: items visible without expanding, one big mango next-step button, urgency for orders waiting 3+ minutes, destructive actions behind a confirmation. Auto-advance is a visible switch the vendor controls.
- Money and destructive actions (payout, delete dish, cancel order) always use a confirmation dialog and toast feedback, never `alert()` / `window.confirm`.
- Menu has a one-tap Available / Sold out switch per dish.

## Partner signup (done)
- Landing (`/partner-signup`) reuses the public `Navbar`/`Footer` inside `.landing`. Every later step uses `components/partner-signup/FlowShell.tsx` (header, 4-step stepper, one focused card) with `components/partner-signup/ui.tsx` (Field, FormError, PrimaryButton).
- Forms use real labels, inline validation and `autoComplete`; the password is never written to storage.
- Do not publish unverified social proof (named testimonials, "thousands of partners", invented tracking IDs).
