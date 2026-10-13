# OYAEAT — UI/UX Rebuild Guide (Staged, Codex-Ready)

Import this file into your repo root as `UI_REBUILD_GUIDE.md`. Work top to bottom.
Each stage ends with a **Codex Prompt** block — paste that whole block into Codex
as one task. Do not skip ahead; each stage assumes the previous one is merged.

---

## 0. Why the current UI reads as "not standard"

Common tells in early Next.js/Tailwind builds that make an app look unfinished
next to Chowdeck/Glovo/Bolt Food:

- **One flat green + white everywhere** — no tonal range, no neutral scale, so
  every screen has the same visual weight and nothing guides the eye.
- **Default Tailwind grays/blues leaking through** on inputs, borders, focus
  rings — mixed with the brand green, so the palette looks accidental.
- **No type scale** — headings, body, and labels are all similar sizes/weights.
- **Inconsistent spacing** — components use ad-hoc `p-4`, `p-3`, `mt-2` instead
  of a shared rhythm.
- **No component system** — every page reinvents its own button/card/input
  styling, so nothing feels consistent across customer/rider/restaurant/admin.
- **No states** — missing empty states, loading skeletons, error states,
  disabled states; screens only look "designed" when populated with data.
- **No elevation/hierarchy** — everything sits flat on white with borders
  instead of using shadow, spacing, and contrast to create depth.

The fix is **not** "add more color." It's: define a real design system once,
then apply it consistently, app by app, in stages.

---

## 1. The New Design System (do this first, everywhere else depends on it)

### 1.1 Brand direction

OYAEAT stays in the green family (that's your brand equity) but green becomes
a **deep, confident jungle green** used for structure/trust (nav, headers,
primary text on light surfaces) — not a bright "default" green filling whole
screens. A single **warm mango/amber accent** is introduced for appetite,
urgency, and calls to action (order now, accept delivery, approve payout).
Everything else is a disciplined neutral scale so the two brand colors stand out.

### 1.2 Color tokens

```css
/* app/globals.css — add inside :root, replace old ad-hoc green vars */
:root {
  /* Brand */
  --oya-green-900: #0b2e22; /* headers, nav, dark surfaces */
  --oya-green-700: #14532d; /* primary buttons on light bg, active nav */
  --oya-green-500: #1f7a4d; /* links, icons, secondary emphasis */
  --oya-green-100: #e4f3ea; /* tinted backgrounds, success chips */

  --oya-amber-600: #e8890c; /* primary CTA (order, accept, pay) */
  --oya-amber-500: #f2a93c; /* hover state */
  --oya-amber-100: #fdefd9; /* badges, highlights */

  /* Neutrals (warm-tinted, not pure gray) */
  --oya-ink-900: #1b1b18; /* body text */
  --oya-ink-600: #55534c; /* secondary text */
  --oya-ink-300: #a9a69c; /* placeholders, disabled */
  --oya-surface-0: #ffffff; /* cards */
  --oya-surface-50: #faf9f5; /* app background */
  --oya-surface-100: #f1efe7; /* section backgrounds, dividers */
  --oya-border: #e6e3d8;

  /* Semantic */
  --oya-success: #1f7a4d;
  --oya-warning: #e8890c;
  --oya-danger: #c1401a;
  --oya-info: #2563a8;

  /* Radius / shadow / motion — used everywhere, not per-component guesses */
  --oya-radius-sm: 8px;
  --oya-radius-md: 14px;
  --oya-radius-lg: 20px;
  --oya-shadow-card:
    0 1px 2px rgba(27, 27, 24, 0.04), 0 8px 24px rgba(27, 27, 24, 0.06);
  --oya-shadow-pop: 0 12px 32px rgba(27, 27, 24, 0.14);
  --oya-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Rules:

- Amber is used **only** for the single most important action per screen
  (place order, accept ride, approve/reject, pay out). Never two amber
  buttons competing on one screen.
- Green-900 is reserved for nav/headers/dark chrome, not body backgrounds.
- No pure black (`#000`) and no pure gray (`#6B7280` Tailwind default) — use
  the ink/surface scale above so the whole app feels like one palette.

### 1.3 Type

Two families, clearly distinct roles:

- **Display/headings:** `Sora` (geometric, confident, reads well at large
  sizes for hero numbers, empty states, section titles).
- **Body/UI:** `Inter` (neutral, excellent at small sizes for tables, forms,
  order cards — this is what most of the app will use).

```ts
// app/layout.tsx
import { Sora, Inter } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

// on <html> or <body>:  className={`${sora.variable} ${inter.variable}`}
```

```css
/* globals.css */
body {
  font-family: var(--font-body), ui-sans-serif, system-ui;
  color: var(--oya-ink-900);
  background: var(--oya-surface-50);
}
h1,
h2,
h3,
.display {
  font-family: var(--font-display), var(--font-body);
  letter-spacing: -0.01em;
}
```

Type scale (use these classes everywhere instead of arbitrary `text-xl`):

| Token           | Size / Line    | Use                                                      |
| --------------- | -------------- | -------------------------------------------------------- |
| `.text-display` | 32px/1.15, 700 | Page hero, big totals (earnings, revenue)                |
| `.text-h1`      | 24px/1.25, 700 | Section titles                                           |
| `.text-h2`      | 18px/1.3, 600  | Card titles, modal titles                                |
| `.text-body`    | 15px/1.5, 400  | Default body                                             |
| `.text-label`   | 13px/1.4, 500  | Form labels, table headers (sentence case, not ALL CAPS) |
| `.text-caption` | 12px/1.4, 400  | Timestamps, helper text                                  |

### 1.4 Tailwind config

```js
// tailwind.config.ts — extend, don't replace
theme: {
  extend: {
    colors: {
      green: { 900: "var(--oya-green-900)", 700: "var(--oya-green-700)", 500: "var(--oya-green-500)", 100: "var(--oya-green-100)" },
      amber: { 600: "var(--oya-amber-600)", 500: "var(--oya-amber-500)", 100: "var(--oya-amber-100)" },
      ink:   { 900: "var(--oya-ink-900)", 600: "var(--oya-ink-600)", 300: "var(--oya-ink-300)" },
      surface: { 0: "var(--oya-surface-0)", 50: "var(--oya-surface-50)", 100: "var(--oya-surface-100)" },
      border: "var(--oya-border)",
      danger: "var(--oya-danger)",
      warning: "var(--oya-warning)",
      info: "var(--oya-info)",
    },
    borderRadius: { sm: "var(--oya-radius-sm)", md: "var(--oya-radius-md)", lg: "var(--oya-radius-lg)" },
    boxShadow: { card: "var(--oya-shadow-card)", pop: "var(--oya-shadow-pop)" },
    fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"] },
  },
},
```

### 1.5 Layout rhythm

- Spacing scale: stick to Tailwind's default steps but only use `4, 6, 8, 12,
16, 24, 32` (i.e. `p-4 p-6 p-8 p-12...`) — ban odd one-offs like `p-3.5`,
  `mt-[13px]` outside of this doc.
- Card padding: `p-6` mobile / `p-8` desktop. Card radius: `rounded-lg`
  (20px). Card shadow: `shadow-card`, `hover:shadow-pop` only on clickable
  cards.
- Max content width per dashboard: `max-w-7xl mx-auto px-4 md:px-8`.

### 1.6 Motion (one rule, applied consistently)

- Buttons/inputs: `transition-colors duration-150 ease-[var(--oya-ease)]`.
- Modals/drawers: slide/fade in `200ms`, no bounce.
- Do **not** add fade-up-on-scroll to every card — reserve any scroll motion
  for the customer-facing landing/menu browsing screens only.

---

## 2. Shared Component Library (build once in `components/ui`, reuse everywhere)

This is the highest-leverage stage — every dashboard (customer, rider,
restaurant, superadmin) will import from here, so fixing it once fixes the
whole app's consistency.

Components to (re)build in `components/ui/`:

- `button.tsx` — variants: `primary` (amber, for the one key action),
  `secondary` (green outline), `ghost`, `danger`. Sizes: `sm/md/lg`. Always
  has a `loading` state (spinner replaces label, width doesn't jump).
- `input.tsx`, `select.tsx`, `textarea.tsx` — consistent border, focus ring in
  `green-500`, error state in `danger` with helper text below.
- `card.tsx` — base card using the tokens above; `CardHeader`, `CardBody`,
  `CardFooter` subcomponents.
- `badge.tsx` — status pills: `pending` (amber-100/amber-600 text),
  `active/success` (green-100/green-700), `failed/cancelled` (danger tint),
  `neutral` (surface-100/ink-600).
- `empty-state.tsx` — icon/illustration slot, `text-h2` title, one line of
  guidance, one primary action button. Used for "no orders yet", "no
  deliveries", "no restaurants pending approval", etc.
- `skeleton.tsx` — shimmer blocks for cards/tables/lists while loading.
- `avatar.tsx`, `stat-card.tsx` (big number + label + trend, for dashboards),
  `data-table.tsx` (consistent header style, row hover, sentence-case
  headers, right-aligned numeric columns).
- `nav/top-nav.tsx`, `nav/sidebar.tsx`, `nav/bottom-nav.tsx` (mobile, for
  customer + rider apps).
- `toast.tsx` — confirmations use the vocabulary of the action taken
  ("Order placed", "Payout approved", "Menu item updated") not generic
  "Success!".

**Codex Prompt — Stage 2:**

```
Using C:\Users\USER\workspace\OYAEAT_RESTURANT, implement the design tokens
from section 1 of UI_REBUILD_GUIDE.md into app/globals.css and
tailwind.config.ts exactly as specified (CSS variables + Tailwind theme
extend). Then load Sora and Inter via next/font/google in app/layout.tsx
per section 1.3.

Next, build/refactor the shared component library in components/ui/ per
section 2 of the guide: button, input, select, textarea, card, badge,
empty-state, skeleton, avatar, stat-card, data-table, and nav primitives
(top-nav, sidebar, bottom-nav). Use only the color/spacing/radius/shadow
tokens defined in globals.css/tailwind.config — no new ad-hoc colors or
one-off spacing values. Each component must support a disabled and
loading/error state where applicable. Do not touch app/customer, app/rider,
app/restaurant, or app/superadmin route files yet — this stage is only the
design tokens and the shared component library. Show me a summary of every
file created/changed when done.
```

---

## 3. Stage-by-Stage Rollout (in this exact order)

Rebuild surface area in this order — each stage is small enough for Codex to
do reliably in one pass, and each one is independently shippable.

### Stage 3 — Public entry points (first impression)

Files: `app/page.tsx`, `components/landing-page/*`, `app/customer/login`,
`app/customer/signup`, `app/rider/login`, `app/rider/register`,
`app/restaurant/login`.

Goals:

- Landing page hero should sell the actual product: fast delivery, live
  tracking, real restaurant photography placeholders — not a generic
  gradient hero.
- Auth screens: centered card, `max-w-md`, brand mark top-left or centered,
  single primary CTA per screen, secondary action as a text link below
  (e.g. "Don't have an account? Sign up").
- Distinguish the three login screens subtly (customer = warm/friendly copy,
  rider = quick/functional copy, restaurant = professional/business copy)
  while sharing the same visual system.

**Codex Prompt — Stage 3:**

```
Using the tokens and shared components from UI_REBUILD_GUIDE.md sections 1-2,
rebuild app/page.tsx, components/landing-page/*, app/customer/login,
app/customer/signup, app/rider/login, app/rider/register, and
app/restaurant/login. Use components/ui primitives (Button, Input, Card) —
do not write new one-off button/input styles in these files. Auth forms use
a centered Card, max-w-md, one primary Button per screen, inline field
validation states using the Input error prop. Keep all existing form logic,
API calls, and routing untouched — this is a visual/markup refactor only.
List every file changed.
```

### Stage 4 — Customer app (highest traffic surface)

Files: `app/customer/dashboard`, `app/customer/restaurant`,
`app/customer/cart`, `app/customer/layout.tsx`.

Goals:

- Dashboard: restaurant discovery grid, using `Card` with image, name,
  cuisine tags, rating badge, delivery time/fee. Category filter chips using
  `Badge`-style pills.
- Restaurant detail page: sticky "Add to cart" bar on mobile once an item is
  selected; menu grouped by category with clear section headers
  (`text-h2`).
- Cart: order summary card, editable quantities, clear price breakdown
  (subtotal, delivery fee, service fee, total) each on its own row —
  this is a trust-building screen, don't compress it.
- Bottom nav (mobile) with 4-5 items max: Home, Orders, Cart, Profile.

**Codex Prompt — Stage 4:**

```
Rebuild app/customer/dashboard, app/customer/restaurant, app/customer/cart,
and app/customer/layout.tsx using the design system and shared components
from UI_REBUILD_GUIDE.md. Requirements: restaurant discovery grid using Card
with image/name/cuisine/rating/delivery-time; category filter chips; sticky
mobile add-to-cart bar on the restaurant detail page; cart screen with a
clear itemized price breakdown (subtotal, delivery fee, service fee, total)
each on its own line; bottom nav with Home/Orders/Cart/Profile for mobile
widths. Preserve all existing data fetching, state management, and routing
logic — only change markup/styling to use the new components and tokens.
List every file changed.
```

### Stage 5 — Restaurant partner dashboard

Files: `app/restaurant/dashboard/*` (orders, menu, analytics, wallet,
staff, reviews, settings, notifications, advertisements, support).

Goals:

- Sidebar nav (desktop) using `nav/sidebar.tsx`, collapsible on tablet.
- Orders: table/list using `data-table`, status via `Badge`
  (`pending`/`preparing`/`ready`/`completed`/`cancelled`), one clear
  primary action per row ("Accept", "Mark ready").
- Analytics/Wallet: `stat-card` for headline numbers (today's revenue,
  orders, avg. prep time, payout balance) above any charts.
- Menu: item cards with image, price, availability toggle — toggle uses
  green when available, neutral when 86'd, never red (red implies error,
  not "out of stock").
- Empty states everywhere data can be zero: "No orders yet today", "No menu
  items — add your first dish".

**Codex Prompt — Stage 5:**

```
Rebuild app/restaurant/dashboard and its subroutes (orders, menu, analytics,
wallet, staff, reviews, settings, notifications, advertisements, support)
using UI_REBUILD_GUIDE.md's design system and components/ui. Use
nav/sidebar.tsx for desktop navigation. Orders list uses data-table +
Badge for status with one primary action button per row. Analytics and
wallet pages lead with stat-card components for headline numbers before any
charts. Menu items are cards with an availability toggle (green = available,
neutral gray = unavailable, never red). Add empty-state components wherever
a list can be empty. Preserve all existing logic/data fetching — visual and
markup refactor only. List every file changed.
```

### Stage 6 — Rider app

Files: `app/rider/dashboard/*` (deliveries, earnings, profile, support),
`app/rider/hooks`.

Goals:

- Mobile-first (riders use this on phones almost exclusively) — bottom nav,
  large tap targets (min 44px height on primary actions).
- Active delivery screen: map/status is the hero, order details
  collapsible below, one large amber "Picked up" / "Delivered" primary
  action that changes label based on state.
- Earnings: `stat-card` for today/week totals, simple list of completed
  deliveries below with amount + time.

**Codex Prompt — Stage 6:**

```
Rebuild app/rider/dashboard and its subroutes (deliveries, earnings,
profile, support) using UI_REBUILD_GUIDE.md's design system and
components/ui, optimized mobile-first with a bottom nav and minimum 44px
tap targets on primary actions. The active-delivery view should show a
single large primary Button whose label reflects delivery state (e.g.
"Confirm pickup" -> "Mark delivered"). Earnings page leads with stat-card
totals followed by a simple delivery history list. Preserve all existing
logic — visual/markup refactor only. List every file changed.
```

### Stage 7 — Superadmin

Files: `app/superadmin/dashboard/*` (businesses, riders, customers, orders,
payout/payouts, restaurants, broadcasts, chat, settings).

Goals:

- This is an internal ops tool — density over decoration. Use
  `data-table` heavily, compact row height, filters/search bar above every
  table.
- Approval flows (new restaurants/riders): clear `Approve` (green) /
  `Reject` (danger outline) pair, never two same-weight buttons.
- Payouts: `stat-card` for pending/processed totals, table below with
  status `Badge`.

**Codex Prompt — Stage 7:**

```
Rebuild app/superadmin/dashboard and its subroutes (businesses, riders,
customers, orders, payout, payouts, restaurants, broadcasts, chat, settings)
using UI_REBUILD_GUIDE.md's design system and components/ui. Prioritize
data density: data-table with compact rows, a search/filter bar above every
table, stat-card summaries at the top of payout/business/order pages.
Approval actions use a paired primary "Approve" (green) button and outline
"Reject" (danger) button of equal size, never mismatched weight. Preserve
all existing logic — visual/markup refactor only. List every file changed.
```

### Stage 8 — Partner signup funnel

Files: `app/partner-signup/*` (add-business, gallery, verify-business,
verify-phone, welcome, success), `components/partner-signup/*`,
`components/gallery/*`.

Goals:

- This is a multi-step form — add a persistent step indicator (e.g. "Step 2
  of 5") at the top, not a plain progress bar with no label.
- One primary action ("Continue") per step, back link secondary.
- Success screen: single celebratory moment (icon/illustration + `text-display`
  headline + one next action), not a wall of text.

**Codex Prompt — Stage 8:**

```
Rebuild app/partner-signup and its subroutes plus components/partner-signup
and components/gallery using UI_REBUILD_GUIDE.md's design system and
components/ui. Add a labeled step indicator ("Step X of Y") at the top of
each step in the flow. Each step has one primary Button ("Continue") and a
secondary back link. The success screen is a single focused moment: icon,
text-display headline, one sentence of confirmation copy, one next-action
button. Preserve all existing logic — visual/markup refactor only. List
every file changed.
```

### Stage 9 — Final polish pass (do this last, across the whole app)

- Run a visual audit for: leftover default Tailwind blue focus rings,
  inconsistent border-radius, any remaining pure green (`#00FF00`-style)
  swatches, ALL-CAPS labels, mismatched button sizes on the same screen.
- Add `prefers-reduced-motion` handling for any custom transitions.
- Check color contrast: body text on `surface-50`/`surface-0` should be
  AA-compliant (ink-900 on those backgrounds already passes).
- Verify every list/table has an empty state and every async action has a
  loading state.

**Codex Prompt — Stage 9:**

```
Audit the entire OYAEAT_RESTURANT app for consistency with
UI_REBUILD_GUIDE.md: find and fix any remaining default Tailwind colors,
inconsistent border-radius values, ALL-CAPS labels, missing empty states,
missing loading states, and buttons that don't use components/ui/button.
Add prefers-reduced-motion handling to any custom CSS transitions/animations.
Report a checklist of what was found and fixed per route group (customer,
rider, restaurant, superadmin, partner-signup).
```

---

## 4. Order of operations recap

1. Section 1 tokens + fonts committed to `globals.css` / `tailwind.config.ts`.
2. Section 2 shared `components/ui` library built and reviewed.
3. Stage 3 → 9 in order, one Codex run per stage, review/test/commit before
   moving to the next.

Do not let Codex touch two stages in one prompt — smaller diffs are easier to
review against this spec and easier to roll back if one stage needs rework.
