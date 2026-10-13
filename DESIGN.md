# OyaEat design system (violet + mango)

One system for the public site, customer app, restaurant, rider and superadmin dashboards.
Tokens live in `app/globals.css` (`:root`, `.dark`, `@theme inline`). Never hardcode hex in new code;
use the semantic Tailwind classes below.

## Color roles
| Role | Token / class | Hex | Use |
|---|---|---|---|
| Brand / structure | `primary`, `violet-700` | `#5b21b6` | headings accents, primary buttons, links, selected tabs, focus |
| Deep violet | `sidebar`, `violet-900` | `#2a1156` | sidebars, hero bands, dark surfaces |
| Soft violet | `secondary`, `muted`, `violet-50/100` | `#f1ebff` | tinted cards, hover, chips |
| Mango (action) | `accent`, `mango-400` | `#fdba2d` | THE one key action per screen (Order now, Accept, Pay), promos, ratings, active sidebar marker |
| Mango deep | `mango-600/700` | `#d97f06` | mango text on light backgrounds (contrast safe) |
| Cream | `cream`, `mango-50/100` | `#fff4d6` | warm section backgrounds, warning chips |
| Ink | `foreground` / `muted-foreground` | `#1a1033` / `#6b6480` | text |
| Success | `success`, `success-soft` | `#15803d` | delivered / approved / online ONLY. Green is status, not brand |
| Danger | `destructive` | `#c8372d` | errors, reject, cancel |

## Rules
1. Violet is the default. Mango is scarce: at most one mango button per view, plus ratings/promo badges.
2. Text on mango is always `--accent-foreground` (#1a1033), never white.
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
