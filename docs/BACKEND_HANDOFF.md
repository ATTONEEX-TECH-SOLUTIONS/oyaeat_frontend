# Backend handoff: what the frontend expects

Generated from the frontend code (branch `claude/eager-pasteur-434ztx`). **Everything below is what the frontend *assumes*.** The point of the backend session is to check each item against the real backend and mark it OK / mismatch / missing.

Base URL: `NEXT_PUBLIC_API_BASE_URL` (a few older files read `NEXT_PUBLIC_API_URL`; new code reads both, base first). Default `http://localhost:5000`.

## 1. Auth: one token key per role (localStorage)

| Role | Token key | Login endpoint | Other keys |
|---|---|---|---|
| Customer | `customer_token` | `POST /customer/auth/login` `{emailOrPhone,password}` | `customer_user` (JSON) |
| Customer signup | same | `POST /customer/auth/register` `{firstName,lastName,email,phone,password}` | |
| Vendor (restaurant) | `authToken` | `POST /auth/login` | `dashboard` (JSON, has `businesses[]`, `firstName`) |
| Vendor signup | `authToken` | `POST /auth/register` `{firstName,lastName,businessType,email,phone,password}` | `sessionStorage.partnerSignupData` (never the password) |
| Rider | `riderToken` | `POST /auth/rider/login` `{email,password}` | |
| Admin | `admin_token` | `POST /admin/auth/login` `{email,password}` → `{token, admin}` | `admin_user` |

Expected response envelope: most routes `{ success, data, message }`. **Exceptions the frontend has to special-case** (check these): `POST /auth/rider/login` returns `{token}` at top level; `GET /rider/dashboard` returns the payload at top level (no `data`); `GET /admin/dashboard/live-riders` returns a bare array; `GET /api/rider/admin/all` returns a bare array; `GET /orders/:id/track-rider` returns `{latitude,longitude,riderName}` at top level; `GET /api/wallet/admin/financial-queue-logs` returns top-level `pendingWithdrawals/linkedAccounts/globalMetrics`.

Questions: are tokens JWTs with a role claim? Does every protected route enforce the **role** (a customer token must not work on `/vendor/*`, `/rider/*`, `/admin/*`)? What happens on expiry (frontend assumes HTTP 401)?

## 2. Endpoints the frontend calls

### Public / customer
- `GET /public/restaurants?limit=&q=` → `data.restaurants[]` with `id,name,type,city,thumbnailUrl,galleryImages[{imageUrl}]` and (optionally) `rating`/`averageRating`
- `GET /public/restaurants/:id/menu` → `data.{restaurant, menu[]}`; menu item `{id,name,category,price,description,imageUrl,isAvailable?}`
- `GET /public/promos/public-feed` → `data[]` `{id,title,desc,bgGradient(url or tailwind classes),businessId,business{name}}`
- `GET /orders/my` (customer token) → `data.orders[]` `{id,status,total,createdAt,businessId,business{name},address,items[{id,menuItemId,name,price,quantity,menuItem?}],rider{firstName,lastName,phone,riderProfile{vehicleType,plateNumber}}}`
- `POST /orders` (cash) `{businessId,customerName,customerPhone,address,notes,items[{menuItemId,quantity}],customerLatitude,customerLongitude,paymentMethod:"cash"}`
- `POST /orders/initialize-payment` same body + `email, callbackUrl` → `data.authorization_url` (Paystack)
- `GET /orders/:id/track-rider` (customer token)

### Vendor (token `authToken`)
- `POST /auth/verify-phone` `{userId,otp}` → may return `token`
- `POST /vendor/:userId/business-details` (JSON) → returns `businessId` (frontend accepts `businessId | id | business.id | data.businessId`)
- `GET /vendor/business/:id`, `GET/PUT /vendor/business/:id/settings` (+ `/settings/:section`), `POST /vendor/:businessId/upload-documents` (multipart keys: `business_license, tax_id, food_certificate, owner_id, bank_document`), `POST /vendor/:businessId/upload-gallery`, `DELETE /vendor/gallery/:imageId`
- `GET /vendor/status`, `GET /vendor/dashboard`
- `GET|POST /vendor/menu`, `PATCH|DELETE /vendor/menu/:id` (multipart with `image`)
- `GET /vendor/orders?status&page&limit`, `PATCH /vendor/orders/:id/status` `{status}`; `POST /orders/:id/dispatch` (called when status becomes `ready`; expects `notifiedRidersCount`)
- `GET|POST /vendor/staff`, `PATCH|DELETE /vendor/staff/:id`
- `GET /vendor/reviews?page&limit`
- `GET /vendor/notifications`, `POST /vendor/notifications/mark-read`
- `GET /vendor/broadcasts/my-active`, `POST /vendor/broadcasts/request-approval`, `.../:id/toggle`
- Wallet (vendor + rider): `GET /api/wallet/summary`, `POST /api/wallet/request-payout` `{amount}`

### Rider (token `riderToken`)
- `POST /auth/rider/register` (multipart: `firstName,lastName,email,phone,vehicleType,plateNumber,password,idDocument`)
- `GET /rider/dashboard` → `{status,riderProfile{status},isOnline,profile{...,avatarUrl,isVerified},stats{todayEarnings,completedToday,hoursOnline},activeDelivery{id,status,payout,distance,restaurant,customer,dropoff},recentDeliveries[],currentLocation?}`
- `POST /rider/shift/toggle` → `{status:"online"|"offline"}`
- `PUT /rider/location/ping` `{latitude,longitude}` (called on every GPS update while online)
- `PUT /rider/orders/:id/accept`, `PUT /rider/orders/:id/complete`
- `PUT /rider/profile/update` (multipart, `avatar`)
- **socket.io** on the base URL, `auth:{token}`, event `NEW_DELIVERY_REQUEST` `{orderId,restaurantName,payout,distance,dropoffAddress}`
- `GET /chat/operations-alerts`

### Chat (all roles; role-specific token)
- `GET|POST /chat/threads`, `GET|POST /chat/threads/:id/messages`, plus `/api/chat/threads/:id` and `/api/chat/threads/:id/status` (note the **two prefixes**, confirm both exist)

### Admin (token `admin_token`)
- `GET /admin/businesses?status&page&limit`, `GET /admin/businesses/stats`, `POST /admin/businesses/:id/approve|reject|suspend` (`reject` and `suspend` take `{reason}`), `PATCH /admin/businesses/:id/status`
- `GET /admin/dashboard/metrics`, `GET /admin/dashboard/live-riders`, `GET /admin/orders?page&limit`, `GET|PUT /admin/settings`
- `GET /api/rider/admin/all`, `PATCH|DELETE /api/rider/admin/:id`, `PATCH /api/rider/admin/:id/status` (**note `/api/rider/admin` vs every other admin route being `/admin/...`**)
- `GET /api/wallet/admin/financial-queue-logs`, `POST /admin/onboard-bank`, `POST /admin/resolve-payout/:transactionId`
- Broadcasts: `GET /admin/broadcasts/pending-reviews|active|approved-list|rejected-history`, `POST .../:id/approve|reject`, `.../:id/toggle`

## 3. Known gaps: frontend needs something the backend may not have
1. **Resend phone code**: `/auth/register` apparently sends the OTP; there is no resend. The frontend had a fake "send/resend" button that I removed.
2. **Decline a delivery offer**: no endpoint; "Decline" only dismisses locally, and the offer likely stays open for other riders / re-dispatches.
3. **Forgot / reset password** (all four roles): no endpoint. The link was removed.
4. **Customer profile update, address book, saved payment methods, notification prefs, referrals, dietary info**: the old settings screen showed these but they never saved. Do endpoints exist?
5. **Customer favourites** are localStorage-only (`liked_restaurants`). Per-account favourites would need an API.
6. **Fees**: the cart shows `₦1,000 delivery + ₦250 service` as client-side constants. The server must compute the real total. Does `POST /orders` ignore any client total?
7. **Restaurant rating / open-closed / delivery fee** on `/public/restaurants`: the UI shows them only if present (`rating` / `averageRating`).
8. **Payment confirmation**: after Paystack the user returns to `/customer/dashboard/orders` and the frontend clears the cart. What marks the order paid (webhook or callback verify)? Can a customer see/pay an order whose payment failed?
9. **Customer order cancellation / reorder validity** (price changed, dish sold out).

## 4. Suspected backend problems to verify (found while reading the frontend)
- **Authorisation**: role checks per route (see §1). The frontend's chat helper falls back to *any* token it finds in localStorage when the role token is missing: check that the chat routes reject a token of the wrong role.
- **Vendor ↔ rider dispatch**: vendor sets `ready` then calls `POST /orders/:id/dispatch`. Is dispatch idempotent? (The orders page had auto-advance that could call it twice; it is now off by default and de-duplicated, but the backend should still guard.)
- **Order status vocabulary**: frontend uses `pending, confirmed?, preparing, ready, out_for_delivery, delivered, cancelled` (+ `rejected`, `failed` in labels). Confirm the real enum. In particular the rider home treats any status except `out_for_delivery` as a "new request".
- **`/rider/dashboard` returns `status` and `riderProfile.status`**: the frontend reads `riderProfile.status || status`. Which is canonical? Possible values assumed: `pending, verified, active, inactive`.
- **Business `suspended`**: encoded in `rejectionReason` as `MAIN:` (hard lock) vs `SHADOW:` / no prefix (hidden storefront). Admin sends `suspensionType`; confirm what is stored and returned.
- **Business type values differ between steps**: signup sends `dine_in_delivery, cloud_kitchen, fast_food_takeaway, home_chef, catering, food_truck`; the add-business step sends `buka_mamaput, fastfood_qsr, casual_dining, ghost_kitchen, pastries_bakery, supermarket_grocery, drinks_liquor`. Which does the model accept? Probably one should be removed.
- **Rider vehicle type values differ**: register sends `motorcycle|bicycle|car`, profile update sends `Motorcycle|Bicycle|Car`.
- **Wallet `getWalletSummary`**: rider response is read as `data.todayEarnings`, `data.weeklyEarnings`, `data.wallet.{balance,transactions}`, `data.linkedBankAccount`, `data.hasBankDetails`; vendor reads `wallet.balance/pendingPayouts/transactions`. Do both match the same endpoint?
- **File uploads**: size/type limits server-side (frontend checks 5MB and PDF/JPG/PNG only client-side).
- **CORS / rate limiting / OTP brute-force** on `/auth/verify-phone` and the login routes.
- **Secrets / config**: fallback to `http://localhost:5000` exists in many places: no effect on the backend but confirm the deployed URL is set in every environment.

## 5. Suggested checklist for the backend session
1. List every route in the backend and diff it against §2 (missing / extra / different method or prefix).
2. For each route, record the actual response shape and note divergences from §1's envelope exceptions.
3. Verify role enforcement (§4 first bullet) with one wrong-role request per route group.
4. Answer the questions in §3 and §4 and mark which need new endpoints.
5. Produce a prioritised fix list: security first, then data-shape mismatches, then missing endpoints the UI needs.
