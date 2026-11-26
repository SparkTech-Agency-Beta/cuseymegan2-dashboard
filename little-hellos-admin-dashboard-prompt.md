# Build Prompt — Little Hellos Admin Dashboard (React + Tailwind)

> Copy everything below the line into your AI coding tool (Claude Code, Cursor, etc.).
> Source design: Figma file `cuseymegan2 || Messaging App`, page **🔥 Final Design** (node `32909:4418`).

---

## 1. Role & Goal

You are a senior frontend engineer. Build the **complete Little Hellos Admin Dashboard** as a production-quality web app using **React + TypeScript + Tailwind CSS**, matching the Figma design pixel-closely. Little Hellos is a kids' messaging app: parents create a family, add children, and invite approved contacts (grandparents, aunts, etc.) by SMS. Subscription plans limit how many contacts a family can approve. This dashboard lets an admin monitor families, invitations, subscriptions, plans, and notifications.

Build all 9 screens listed in section 5, with a clean, scalable folder structure, reusable components, typed mock data, and an API layer that can later be swapped for a real backend with no UI changes.

## 2. Tech Stack (use exactly this)

| Concern            | Choice                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Build tool         | Vite + React 18 + TypeScript (strict mode)                                                      |
| Styling            | Tailwind CSS v3 with design tokens in `tailwind.config.ts` (no inline hex values in components) |
| Routing            | React Router v6 (nested layout routes)                                                          |
| Server state       | TanStack Query v5                                                                               |
| Forms & validation | React Hook Form + Zod                                                                           |
| Icons              | lucide-react (mapping in section 4.4)                                                           |
| Chart              | Recharts (bar chart on Overview), or pure Tailwind bars if simpler                              |
| Mock backend       | MSW (Mock Service Worker) serving typed JSON fixtures                                           |
| Utilities          | `clsx` + `tailwind-merge` via a `cn()` helper, `date-fns` for dates                             |
| Quality            | ESLint + Prettier, absolute imports via `@/` alias                                              |

## 3. Folder Structure

```
src/
├── app/
│   ├── App.tsx                 # Providers (QueryClient, Router, Auth)
│   ├── router.tsx              # All route definitions
│   └── providers/
│       └── AuthProvider.tsx    # Fake auth (token in memory + sessionStorage)
├── layouts/
│   ├── AuthLayout.tsx          # Centered card + background glows (Sign In)
│   └── DashboardLayout.tsx     # Sidebar + Top bar + <Outlet />
├── components/
│   ├── ui/                     # Primitive, design-system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── FieldLabel.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx           # Count badge (e.g. "5" on Notifications nav)
│   │   ├── StatusPill.tsx      # active | expired | limit | pending | accepted | connected | live
│   │   ├── PlanTag.tsx         # Immediate Family | Extended Family | Unlimited | Yearly | Monthly
│   │   ├── ProgressTrack.tsx   # Usage bars (8px, 10px, 12px variants)
│   │   ├── FilterTabs.tsx      # Pill filters with counts ("Active  1,086")
│   │   ├── Stepper.tsx         # − value + (Edit Plan modal)
│   │   ├── Modal.tsx           # Accessible dialog (focus trap, Esc, overlay click)
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── data-table/
│   │   ├── DataTable.tsx       # Generic typed table: columns config, row click, loading/empty states
│   │   └── TablePagination.tsx # "Showing 1–9 of 1,248" + prev/next
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── AdminCard.tsx       # Bottom-of-sidebar profile + logout
│   │   ├── TopBar.tsx          # Title, subtitle, search, notification bell
│   │   └── BackgroundGlow.tsx
│   └── shared/
│       ├── PersonCell.tsx      # Avatar + name + secondary line (phone / "Parent")
│       ├── UsageCell.tsx       # "2 / 2" + track, or "9 · unlimited"
│       └── StatCard.tsx        # Icon tile + label + big number + caption
├── features/
│   ├── auth/       (SignInPage.tsx, schema.ts, api.ts)
│   ├── overview/   (OverviewPage.tsx, NewFamiliesChart.tsx, PlanDistribution.tsx, RecentFamilies.tsx, api.ts)
│   ├── families/   (FamiliesPage.tsx, FamilyDetailPage.tsx, components/, api.ts, types.ts)
│   ├── invitations/(InvitationsPage.tsx, api.ts, types.ts)
│   ├── subscriptions/(SubscriptionsPage.tsx, api.ts, types.ts)
│   ├── plans/      (PlansPage.tsx, PlanCard.tsx, EditPlanModal.tsx, schema.ts, api.ts)
│   └── notifications/(NotificationsPage.tsx, NotificationItem.tsx, api.ts, types.ts)
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   └── fixtures/   (families.ts, invitations.ts, subscriptions.ts, plans.ts, notifications.ts, stats.ts)
├── lib/
│   ├── apiClient.ts            # fetch wrapper, base URL from env, error normalization
│   ├── cn.ts
│   ├── format.ts               # formatCurrency, formatNumber (1,248), formatDate (Nov 2, 2026), timeAgo
│   └── queryKeys.ts
├── types/
│   └── domain.ts               # Shared domain types (section 6)
├── styles/
│   └── index.css               # Tailwind layers + font import
└── main.tsx
```

Rules: each feature owns its page, sub-components, API hooks, and types. Shared UI only goes in `components/`. No business logic inside UI primitives.

## 4. Design System

### 4.1 Canvas & layout grid (from Figma)

- Design frame: **1440 × 1024** desktop.
- **Sidebar:** fixed, **248px** wide, full height. Inner content width **212px** (18px horizontal padding).
- **Main area:** 1192px wide with **32px** horizontal padding, content width **1128px**.
- **Top bar:** height **66px** — left: page title (~36px bold, 44px line) + subtitle (14px, muted); right: search input **300 × 48** + bell button **48 × 48** with unread dot.
- Vertical gap between main sections: ~24–32px.
- A soft decorative **radial glow** (520px ellipse, blurred, brand color, low opacity) sits top-right behind every page. Sign In has two glows (top-right 520px, bottom-left 480px).

### 4.2 Tokens

The exact hex values, font family, radii and shadows must be read from Figma (Dev Mode → Inspect) and put in `tailwind.config.ts` under these names. Do not invent values in components; always reference tokens.

```ts
// tailwind.config.ts → theme.extend
colors: {
  brand:   { DEFAULT, soft, strong },        // primary buttons, active nav, chart bars, glows
  surface: { DEFAULT, muted, sunken },       // page bg, cards, inputs, table header
  ink:     { DEFAULT, muted, subtle },       // primary text, secondary text, captions
  line:    { DEFAULT },                      // borders, table dividers
  success: { DEFAULT, soft },                // Active, Accepted, Connected, Live
  warning: { DEFAULT, soft },                // Pending
  danger:  { DEFAULT, soft },                // Expired, Limit reached
  plan: {
    immediate: { DEFAULT, soft },
    extended:  { DEFAULT, soft },
    unlimited: { DEFAULT, soft },
  },
},
borderRadius: { card, input, pill },
boxShadow:    { card, modal },
fontFamily:   { sans: [/* family from Figma */, 'ui-sans-serif', 'system-ui'] },
```

### 4.3 Typography scale (approximate from layer sizes — verify in Figma)

| Use                                           | Size / line height                   | Weight           |
| --------------------------------------------- | ------------------------------------ | ---------------- |
| Page title (Top bar)                          | 36 / 44                              | Bold             |
| Stat number                                   | 34 / 41                              | Bold             |
| Sign-in title                                 | 32 / 41                              | Bold             |
| Section title ("Recent families", "Children") | 24 / 30                              | Bold             |
| Card title ("Plan distribution")              | 22 / 27                              | Bold             |
| Nav item, body                                | 17 / 22                              | Medium           |
| Table cell                                    | 16 / 20                              | Regular / Medium |
| Table header, field label                     | 12–13 / 16, UPPERCASE, letter-spaced | Semibold         |
| Caption ("+42 this month")                    | 14 / 18                              | Medium           |

### 4.4 Icons (Figma layer → lucide-react)

`grid → LayoutGrid`, `users → Users`, `mail → Mail`, `card → CreditCard`, `layers → Layers`, `bell → Bell`, `search → Search`, `logout → LogOut`, `check → Check`, `clock → Clock`, `lock → Lock`, `chev → ChevronRight`, `edit → Pencil`, `x → X`, `plus → Plus`, `minus → Minus`.
Sizes: nav 22px, stat tile 26px (inside a 56px rounded tile), notification 24px (inside 48px tile), pills 14px, buttons 20–22px.

### 4.5 Core component specs

- **Nav item:** 212 × 50, icon + label, 12px gap. Active state = brand background tint + brand text/icon. Notifications item shows a 24px round count **Badge** on the right.
- **Admin card (sidebar bottom):** 212 × 64, 40px avatar, "Admin" + email or "Signed in", logout icon button on the right.
- **StatCard:** height 118, 56px icon tile + label (15px muted) + number (34px bold) + optional caption (green/brand). Three per row, equal width (`grid-cols-3`).
- **FilterTabs:** pills, height 44, label + count separated by spacing (e.g. `All  1,248`). Selected pill is filled; others outlined/muted. Right side shows `Showing X–Y of Z`.
- **DataTable:** header row 44px, uppercase muted labels; body rows 68px with dividers; hover state; rows clickable where noted. Column widths in section 5 are from Figma — use them as proportional `grid-cols`/`width` values.
- **PersonCell:** 42px avatar (initials fallback with deterministic color) + name (16px semibold) + secondary line (14px muted).
- **StatusPill (height 30):** icon + label.
  - `active` → check, success — "Active"
  - `accepted` → check, success — "Accepted"
  - `connected` → check, success — "Connected"
  - `live` → check, success — "Live"
  - `pending` → clock, warning — "Pending"
  - `expired` → clock, danger — "Expired"
  - `limit` → lock, danger — "Limit reached"
- **PlanTag (height 30):** colored soft pill per plan; also used for billing cycle `Yearly` / `Monthly` (neutral style) and "Last 12 months".
- **UsageCell:** `used / limit` text above an 8px track (90px wide); track turns danger color when `used === limit`. For unlimited plans render text only: `9 · unlimited` (Families) or `9 · ∞` (Subscriptions).
- **Inputs:** height 52–54 (60 in modal), label above (uppercase small label in Plans/Modal, sentence case on Sign In).
- **Primary button:** brand fill, height 52–58, full width in cards/forms. **Secondary button:** outlined/neutral (Modal "Cancel").

## 5. Screens (analyze each and implement)

All dashboard screens share `DashboardLayout` (Sidebar + TopBar + glow). Routes:

| Route                      | Screen                            | Top bar title / subtitle                              | Search placeholder  |
| -------------------------- | --------------------------------- | ----------------------------------------------------- | ------------------- |
| `/login`                   | Admin · Sign In                   | —                                                     | —                   |
| `/` → redirect `/overview` |                                   |                                                       |                     |
| `/overview`                | Admin · Overview                  | Overview / "See how families are using Little Hellos" | Search families…    |
| `/families`                | Admin · Families                  | Families / "All parent accounts and their plans"      | Search families…    |
| `/families/:familyId`      | Admin · Family Detail             | {Parent name} / "Parent account · Joined {date}"      | Search families…    |
| `/invitations`             | Admin · Invitations               | Invitations / "SMS invitations sent to contacts"      | Search invitations… |
| `/subscriptions`           | Admin · Subscriptions             | Subscriptions / short subtitle                        | Search…             |
| `/plans`                   | Admin · Plans (+ Edit Plan modal) | Plans / short subtitle                                | Search…             |
| `/notifications`           | Admin · Notifications             | Notifications / short subtitle                        | Search…             |

(Subtitles marked "short subtitle" are truncated in the layer data — copy the exact text from Figma.)

### 5.1 Sign In (`/login`)

- Full-screen page with two background glows; centered **Login card 460 × 567**.
- Content top to bottom: App icon (96px), title **"Little Hellos Admin"**, subtitle "Sign in to manage families…" (copy full text from Figma), **Email** field (placeholder `admin@littlehellos.app`), **Password** field (masked, add show/hide toggle), full-width **Sign In** button (58px).
- Zod validation: valid email, password min 8. Show inline errors, disable button + spinner while submitting, show an error banner on bad credentials.
- On success store session and redirect to the page the user originally requested (or `/overview`). Protect all dashboard routes with a `RequireAuth` wrapper.

### 5.2 Overview (`/overview`)

1. **Stats row (3 StatCards):**
   - Families — `1,248` — caption "+42 this month" — icon users
   - Active subscriptions — `1,086` — caption "87% of families" — icon card
   - Pending invitations — `214` — no caption — icon mail
2. **Charts row:**
   - **New families chart** (728 × 304): heading "New families" + subtitle "Last 12 months", a `Last 12 months` tag on the right; 12 rounded vertical bars (30px wide), months **Dec → Nov**, increasing trend; the latest month (Nov) highlighted. Tooltip on hover with exact count.
   - **Plan distribution** (380 wide): three rows, each label + percent and a 12px track — Immediate Family **52%**, Extended Family **33%**, Unlimited **15%**, each in its plan color.
3. **Recent families** section: title + "View all" link (→ `/families`). Table columns: **PARENT** (550, PersonCell with phone) · **PLAN** (170, PlanTag) · **STATUS** (150) · **JOINED** (130). 4 rows. Row click → family detail.

### 5.3 Families (`/families`)

- FilterTabs: **All 1,248 · Active 1,086 · Expired 98 · Limit reached 64**; right: "Showing 1–9 of 1,248".
- Table columns: **PARENT** (416, PersonCell + phone) · **CHILDREN** (100, number) · **CONTACTS USED** (140, UsageCell) · **PLAN** (170) · **STATUS** (150) · chevron (24).
- Whole row clickable → `/families/:id`. 9 rows per page with pagination.
- Filter, search (top bar) and page are synced to URL query params (`?status=active&q=sarah&page=2`).

### 5.4 Family Detail (`/families/:familyId`)

Two-column body (Left 360px, Right 748px, 20px gap):

- **Left / Parent card** (360 × 423): 96px avatar, name, phone, StatusPill, then a details list of 3 rows (46px each, label left, value right, dividers): Children `2`, Joined `Nov 2, 2026`, Parent passcode `Set`/`Not set`.
- **Left / Subscription card** (360 × 215): top row "SUBSCRIPTION" label + StatusPill; plan name large ("Immediate Family"); "$15 / year · Renews Mar 12, 2027"; usage row "Contacts used — 2 of 2"; 10px track.
- **Right / Children**: section title + 2-column grid of child cards (366 × 96): 64px avatar, child name, "1 approved contact".
- **Right / Approved contacts**: table — **CONTACT** (272, PersonCell e.g. Grandma + phone) · **FOR CHILD** (110) · **STATUS** (150: Connected / Pending) · **ADDED** (120).
- Handle loading (skeletons), not-found (EmptyState with back link), and a back affordance to Families.

### 5.5 Invitations (`/invitations`)

- FilterTabs: **All 1,644 · Pending 214 · Accepted 1,430**; "Showing 1–8 of 1,644".
- Columns: **INVITED CONTACT** (426, PersonCell e.g. "Aunt Sarah" + phone) · **FOR CHILD** (120) · **INVITED BY** (180, parent name, links to that family) · **SENT** (140, date) · **STATUS** (150, Pending / Accepted).
- 8 rows per page.

### 5.6 Subscriptions (`/subscriptions`)

- Stats row: **Active 1,086** ("87% of families", check icon) · **Expired 98** (clock) · **At contact limit 64** (lock).
- FilterTabs (no counts here): **All · Active · Expired · Limit reached**; "Showing 1–7 of 1,248".
- Columns: **FAMILY** (224, PersonCell with "Parent") · **PLAN** (170) · **BILLING** (100, Yearly/Monthly tag) · **PRICE** (90) · **CONTACTS** (120, UsageCell, `9 · ∞` for Unlimited) · **RENEWS** (130, date or "Expired Oct 28") · **STATUS** (150).
- Row click → family detail.

### 5.7 Plans (`/plans`)

- Three equal plan cards in a row (≈361 × 453):

| Plan             | Subtitle           | Contact limit | Monthly       | Yearly        |
| ---------------- | ------------------ | ------------- | ------------- | ------------- |
| Immediate Family | Up to 2 contacts   | 2 contacts    | $1.99 / month | $15 / year    |
| Extended Family  | Up to 6 contacts   | 6 contacts    | $2.99 / month | $25 / year    |
| Unlimited        | Unlimited contacts | Unlimited     | $4.99 / month | $49.99 / year |

- Each card: name + subtitle, "Live" StatusPill, three **read-only** fields (CONTACT LIMIT, MONTHLY PRICE, YEARLY PRICE), full-width **Edit plan** button (pencil icon) → opens modal.

### 5.8 Edit Plan modal (on `/plans`, state `?edit=extended`)

- Dimmed overlay over the Plans page; modal **520 × 530**.
- Header: "Edit plan" + PlanTag of the plan, close (X) button 44px.
- **CONTACT LIMIT:** Stepper (− 48px / value "6 contacts" / + 48px). Min 1; for Unlimited show an "Unlimited" toggle instead of the stepper.
- **MONTHLY PRICE:** input with `$` and suffix "per month". **YEARLY PRICE:** input with suffix "per year". Zod: positive number, max 2 decimals; warn (non-blocking) if yearly ≥ 12 × monthly.
- Actions: **Cancel** (secondary) and **Save changes** (primary, check icon), each 222 × 56.
- Save → mutation with optimistic update of the plan card, success toast, close modal. Esc / overlay / X closes; confirm discard if form is dirty. Focus trapped; returns focus to the Edit button.

### 5.9 Notifications (`/notifications`)

- Toolbar: FilterTabs **All 12 · Unread 5**; right: "Mark all as read" (check icon).
- List of 84px items: 48px icon tile, title (bold), description, relative time on the right, 10px unread dot if unread. Types and icons:
  - New family joined → users — "Sarah Miller created a family…"
  - Contact limit reached → lock — "Tom Walker reached the 2-contact limit…"
  - Subscription expired → clock — "Omar Hassan's Immediate Family plan…"
  - Plan upgraded → card — "Priya Nair upgraded to Unlimited…"
- Clicking an item marks it read and navigates to the related family. Sidebar badge and top-bar bell dot reflect the live unread count.

## 6. Domain Types (`src/types/domain.ts`)

```ts
export type PlanId = 'immediate' | 'extended' | 'unlimited';
export type BillingCycle = 'monthly' | 'yearly';
export type FamilyStatus = 'active' | 'expired' | 'limit';
export type InvitationStatus = 'pending' | 'accepted';
export type ContactStatus = 'connected' | 'pending';

export interface Plan {
  id: PlanId;
  name: string;
  contactLimit: number | null; // null = unlimited
  monthlyPrice: number;
  yearlyPrice: number;
  isLive: boolean;
}
export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  approvedContacts: number;
}
export interface Contact {
  id: string;
  name: string;
  phone: string;
  childId: string;
  childName: string;
  status: ContactStatus;
  addedAt: string;
}
export interface Family {
  id: string;
  parentName: string;
  phone: string;
  avatarUrl?: string;
  joinedAt: string;
  hasPasscode: boolean;
  children: Child[];
  contacts: Contact[];
  subscription: Subscription;
}
export interface Subscription {
  planId: PlanId;
  billing: BillingCycle;
  price: number;
  contactsUsed: number;
  contactLimit: number | null;
  renewsAt: string | null;
  expiredAt: string | null;
  status: FamilyStatus;
}
export interface Invitation {
  id: string;
  contactName: string;
  phone: string;
  childName: string;
  invitedBy: { familyId: string; name: string };
  sentAt: string;
  status: InvitationStatus;
}
export type NotificationType =
  'family_joined' | 'limit_reached' | 'subscription_expired' | 'plan_upgraded';
export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  familyId?: string;
}
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  counts?: Record<string, number>;
}
```

## 7. API Contract (mocked with MSW, same shape for the real backend)

```
POST   /api/auth/login                 { email, password } → { token, admin }
GET    /api/stats/overview             → stats, newFamiliesByMonth[12], planDistribution
GET    /api/families?status&q&page     → Paginated<Family> (+ counts per status)
GET    /api/families/:id               → Family
GET    /api/invitations?status&q&page  → Paginated<Invitation>
GET    /api/subscriptions?status&q&page→ Paginated<Family> + stats
GET    /api/plans                      → Plan[]
PATCH  /api/plans/:id                  { contactLimit, monthlyPrice, yearlyPrice } → Plan
GET    /api/notifications?filter       → AdminNotification[] + unreadCount
PATCH  /api/notifications/:id/read
POST   /api/notifications/read-all
```

Seed fixtures with the exact names, phones, dates, prices and counts shown in the design (Sarah Miller, James Carter, Priya Nair, Omar Hassan, Emily Chen, Daniel Brooks, Tom Walker, Maria Lopez; children Leo, Mia, Noah; contacts Grandma Rose, Grandpa Joe, Aunt Sarah, Uncle Raj, Cousin Emma, Dad), then generate extra rows so pagination totals look real. Add 300–600ms artificial latency.

## 8. Behaviour & Quality Requirements

- **States everywhere:** loading skeletons matching row/card shapes, empty states ("No families match your filters"), and error states with retry.
- **Search:** debounced 300ms, scoped to the current page's resource, synced to `?q=`.
- **Responsive:** design is 1440 desktop. ≥1280 matches Figma; 1024–1279 tighter padding and Family Detail stacks if needed; <1024 sidebar collapses to an icon rail or off-canvas drawer with a hamburger in the top bar; tables scroll horizontally inside their own container.
- **Accessibility:** semantic `<nav>`, `<table>`/`<th scope>`, visible focus rings, `aria-current="page"` on active nav, labelled icon buttons, modal with `role="dialog"` + `aria-modal`, colour is never the only status signal (pills always have icon + text).
- **Formatting:** numbers `1,248`; currency `$2.99` / `$15`; dates `Nov 2, 2026`; relative times "2 min ago", "1 hr ago", "Yesterday".
- **Code quality:** no `any`; props typed; components < ~150 lines; table columns defined as typed config arrays; query keys centralized; env var `VITE_API_URL`; MSW enabled only when `VITE_USE_MOCKS=true`.

## 9. Delivery Order

1. Scaffold project, Tailwind tokens, fonts, `cn`, formatters, MSW.
2. UI primitives + layout (Sidebar, TopBar, DashboardLayout, AuthLayout).
3. Sign In + auth guard.
4. Overview → Families → Family Detail → Invitations → Subscriptions → Plans + Edit modal → Notifications.
5. Loading/empty/error states, responsive pass, accessibility pass.
6. README with setup (`npm i`, `npm run dev`), env vars, folder overview and how to switch from mocks to the real API.

## 10. Acceptance Checklist

- [ ] All 9 screens implemented and reachable from the sidebar / row clicks.
- [ ] Visual match to Figma at 1440px (spacing, sizes, colours from tokens, icons).
- [ ] Filters, search and pagination work and persist in the URL.
- [ ] Edit Plan saves, validates, updates the card optimistically, and the change shows on Overview/Subscriptions.
- [ ] Notifications read/unread updates the sidebar badge and bell dot.
- [ ] Protected routes redirect to `/login`; logout clears the session.
- [ ] `npm run build` and `npm run lint` pass with zero errors.
