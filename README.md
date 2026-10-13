# OyaEat

Multi-role food-delivery platform: customer ordering, restaurant partner
dashboard, rider dispatch, and super-admin operations, plus a public landing
page and partner-onboarding funnel.

> Status: **frontend is well advanced, not yet production-ready.** This repo
> is a Next.js frontend only — it depends on a separate backend API and has
> no test suite or CI yet. See [Known Issues](#known-issues--completion-plan)
> before shipping.

---

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Radix / shadcn-style UI primitives (`components/ui`)
- Google Maps (address selection, live tracking)
- Socket.IO (live delivery/dispatch events)
- Paystack (payment initialization)
- REST client layer for vendor, wallet, chat, and admin workflows (`lib/api/*`)
- Client-side session/cart persistence via `localStorage`

This repository has no `route.ts` API endpoints — it requires a separately
running backend.

## Getting started

```bash
npm install
cp .env.example .env.local   # see Environment variables below
npm run dev
```

### Environment variables

Create `.env.local` with at minimum:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

`NEXT_PUBLIC_API_BASE_URL` must point at a running instance of the OyaEat
backend (not included in this repo). Without it, all data-fetching screens
(discovery, orders, wallet, dispatch, admin) will fail to load.

## Project structure

```
app/
  customer/       customer storefront, cart, checkout, orders, dashboard
  restaurant/     partner login + dashboard (orders, menu, wallet, staff, analytics...)
  rider/          rider login/register + dashboard (deliveries, earnings, profile)
  superadmin/     admin login + dashboard (businesses, riders, orders, payouts...)
  partner-signup/ multi-step restaurant onboarding funnel
components/
  ui/             shared design-system primitives (button, card, input, badge...)
  landing-page/   public homepage sections
  partner-signup/ onboarding funnel components
  gallery/        image upload/gallery components
  rider/          rider-specific components
  chat/           admin/support chat components
lib/              API clients, utilities
hooks/            shared React hooks
config/           app configuration
```

## Implemented product areas

| Area                | Status                                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public landing page | Marketing nav, hero, restaurant/category cards, footer. Display data is currently hard-coded, not live.                                                                                                                                           |
| Customer            | Signup/login, discovery, restaurant menus, cart (localStorage), checkout (cash/card/transfer), order creation + payment init, order tracking, dashboard shell.                                                                                    |
| Restaurant partner  | Registration + phone/business verification, business creation + gallery upload, dashboard, order management, menu CRUD, staff, wallet/payouts, reviews, analytics, notifications, settings, advertising requests, suspension/verification states. |
| Rider               | Registration/login, dashboard + shift toggle, live location pings, socket-based delivery matching, accept/complete deliveries, history, earnings, profile, support.                                                                               |
| Super-admin         | Login, dashboard metrics, business approval/rejection/suspension, restaurant + rider admin, order monitoring, broadcast/ad moderation, payout queue, admin chat, live rider map, settings.                                                        |

Estimated completion (frontend-only view — backend not verifiable from this repo):

| Area                                    | Estimate |
| --------------------------------------- | -------- |
| UI screens & visual design              | 75–85%   |
| Frontend feature interactions           | 60–70%   |
| Backend integration readiness           | 45–60%   |
| Production readiness                    | 30–40%   |
| Documentation, testing, release process | 10–20%   |

## Known issues & completion plan

### Critical (fix before adding new screens)

- **No backend in this repo.** Auth enforcement, DB, payment webhooks,
  notifications, and file storage all live in a separate service and
  cannot be verified here.
- **Dead links.** Landing nav links to `/about`, `/features`,
  `/how-it-works`, `/careers`, `/login` — none exist. `/customer/cart`
  links to `/customer/checkout`, but checkout actually lives at
  `/customer/dashboard/checkout`. Rider nav links to
  `/rider/dashboard/notifications`, which doesn't exist.
- **Duplicated customer journeys.** Two parallel restaurant/cart route
  families exist: `/customer/restaurant/[id]` + `/customer/cart` **and**
  `/customer/dashboard/restaurant/[id]` + `/customer/dashboard/cart`.
  Pick one and consolidate, or these will keep producing inconsistent
  cart/checkout state.
- **Corrupted naira symbol (`â‚¦`)** appears in multiple UI strings —
  replace with `₦` or `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`
  everywhere prices are rendered.
- **No payment-result screen.** Checkout redirects to an external Paystack
  URL but there's no dedicated confirmation/failure page, and payment
  status must ultimately be verified server-side via webhook, not trusted
  from the client redirect alone.
- **Inconsistent auth token keys** across areas: `authToken`,
  `vendor_token`, `customer_token`, `riderToken`, `rider_token`,
  `admin_token`, `adminToken`. Standardize to one convention per role
  (e.g. `oya_<role>_token`) to stop intermittent logout/authorization bugs.
- **`ignoreBuildErrors: true`** in `next.config.mjs` hides real TypeScript
  errors in production builds — remove once the type errors underneath are
  fixed.

### Medium

- Landing page and discovery search/recommendations are hard-coded demo
  data, not wired to live restaurant/category/promotion endpoints.
- Route protection is client-side (localStorage) only — treat the backend
  as the sole source of truth for authorization; client guards are UX only.
- Several interactive controls are non-semantic `div`/`label` elements
  instead of `<button>`/`<input type="radio">` — weakens keyboard and
  screen-reader support.
- No `.env.example` existed previously (added above) and this file
  replaces the placeholder `readme` (`"hello in progress"`).

### Engineering / process gaps

- No automated tests (unit, integration, e2e, accessibility, visual
  regression). Priority coverage: login, cart persistence, checkout,
  payment callback, menu CRUD, rider accept/complete, admin approval
  actions.
- No CI. At minimum, run install → lint → type-check → test → build on
  every pull request.
- API-client fragmentation: overlapping chat types/implementations in
  `lib/api/chat.ts` and `lib/types/chat.ts`; inconsistent endpoint/token
  conventions across clients — consolidate into one typed API layer with
  shared auth handling.

### Accessibility

- Replace clickable `div`/`label` patterns with semantic elements.
- Ensure icon-only controls have accessible names (`aria-label`).
- Add visible keyboard focus states across dashboard tables, menus, maps,
  and modals.
- Verify text contrast on tinted/green surfaces.
- Associate form errors with `aria-describedby` and focus the first
  invalid field on submit.
- Test ordering and delivery workflows keyboard-only.

## Roadmap

**Phase 1 — Make core journeys reliable**

1. Fix all dead links and the checkout route mismatch.
2. Fix the naira character everywhere prices render.
3. Standardize auth token storage/naming across all four roles.
4. Add a payment callback/result page backed by server-verified status.
5. Keep `.env.example` current; document all required variables.
6. Remove `ignoreBuildErrors` and resolve the underlying type errors.

**Phase 2 — Complete the marketplace**

1. Wire landing page + discovery to live restaurant/category/promotion data.
2. Consolidate the two customer cart/restaurant route families into one.
3. Finish favourites, notifications, account recovery, support workflows.
4. Build the missing rider notifications route and delivery exception states.
5. Validate every admin action against real backend responses/errors.

**Phase 3 — Production readiness**

1. Add unit + end-to-end tests; add CI (lint, type-check, test, build).
2. Add error monitoring, analytics, audit logging, structured API errors.
3. Mobile-device and accessibility QA pass.
4. Document deployment, secrets, backend prerequisites, payment webhooks,
   Google Maps setup.

## UI/UX rebuild

A separate staged design-system rebuild (tokens, shared component library,
and a per-role rollout plan for Codex) lives in
[`UI_REBUILD_GUIDE.md`](./UI_REBUILD_GUIDE.md). Sequence it alongside the
roadmap above rather than before it:

- Do **Phase 1** items (dead links, currency, auth tokens, build errors)
  _in the same pass_ as whichever UI rebuild stage touches those files —
  e.g. fix the naira symbol and cart/checkout route mismatch while
  rebuilding the customer app in Stage 4, not as a separate pass, since
  you'll already be inside those files.
- Don't run visual polish (Stage 9) until Phase 1 functional fixes are in,
  or the audit will re-flag files that are about to change again.
