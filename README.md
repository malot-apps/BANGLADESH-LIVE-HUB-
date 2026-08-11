# 🇧🇩 Bangladesh Live Hub

> **Bangladesh Live Hub** is a Bangladesh-focused, mobile-first information dashboard built with **Next.js App Router + React + TypeScript**. The current codebase combines live-information UI, weather, alerts, news/RSS aggregation, commodity-price cards, opportunities/jobs, trending topics, live-TV/HLS playback, sharing, district personalization, and an early-stage admin dashboard.

**Repository status:** Demo / prototype with a strong UI foundation.  
**Production status:** **Not production-ready yet.** The production-hardening checklist in this document is required before public launch.

---

## 1. What this project contains

The project currently has **two overlapping generations of implementation**:

### A. Main Next.js application — recommended foundation

The primary application is under:

```text
app/
components/
lib/
hooks/
public/
```

It uses Next.js App Router and exposes internal API routes under:

```text
app/api/
```

The main dashboard loads data through relative endpoints such as:

```text
/api/weather
/api/news
/api/prices
/api/alerts
/api/opportunities
/api/trending
/api/tv-proxy
/api/admin/audit
```

### B. Legacy / parallel static implementation

There is also an older browser/static implementation under:

```text
client/
admin/
api/
```

and supporting files such as:

```text
stream-proxy.js
api/channels.js
api/alerts.js
api/sources.js
```

These should **not** be treated as an independent production backend without additional work. They appear to be remnants / alternative prototypes and create duplication with the Next.js implementation.

**Recommended direction:** keep the Next.js application as the single source of truth and either archive or remove the legacy static implementation after confirming it is no longer required.

---

# 2. Feature inventory

## 2.1 Main dashboard

The home page currently provides:

- Bangladesh-focused dashboard
- Bengali / English language toggle
- District selection
- Saved district preference using browser localStorage
- Search input
- Category filtering
- Trending topics
- Master refresh
- Last-updated indicator
- Share action
- Mobile bottom navigation
- Responsive desktop layout
- Weather card
- Emergency alert card
- Breaking-news section
- Alert map / district alert section
- Commodity-price section
- Jobs / opportunities section
- My Area dashboard
- Live TV section
- Profile / personalization UI
- Admin dashboard modal / admin routes

Main entry:

```text
app/page.tsx
```

---

## 2.2 Weather

Endpoint:

```text
GET /api/weather?district=dhaka
```

The weather route uses district metadata from:

```text
lib/bangladeshData.ts
```

and fetches forecast information from **Open-Meteo**.

Current data includes:

- Temperature
- Feels-like temperature
- Humidity
- Wind speed
- Pressure
- Precipitation
- Weather condition
- Weather icon
- Daily forecast
- Rain probability
- Updated timestamp
- Fallback response when upstream data fails

### Important production note

The route contains fallback weather values. These are useful for demo resilience but **must not be presented as live information** unless clearly labeled.

The source string currently mentions:

```text
Open-Meteo & BMD Data Sync
```

but the implementation should be audited before claiming that BMD is actually being synchronized.

---

## 2.3 News / RSS aggregation

Endpoint:

```text
GET /api/news
GET /api/news?category=all
GET /api/news?category=all&search=...
```

The news route aggregates / parses RSS or source data.

Current project references include sources such as:

- Prothom Alo
- The Daily Star
- Dhaka Tribune
- bdnews24
- BMD
- DAM
- BRTA
- education-related government sources
- Election Commission
- ICT Division
- Bangladesh cricket-related source

### Production requirements

For every source:

1. Verify the source actually permits automated aggregation.
2. Verify RSS/API terms.
3. Do not scrape protected pages merely because they are publicly viewable.
4. Store source URL and attribution.
5. Add source-specific timeout handling.
6. Add retry/backoff.
7. Cache successful responses.
8. Prevent one failed source from breaking the complete news feed.
9. Deduplicate articles by stable URL / GUID.
10. Store publication timestamps.
11. Sanitize HTML before rendering.
12. Never trust remote HTML as safe markup.

---

# 3. API / backend map

The current Next.js backend is primarily located here:

```text
app/api/
```

## 3.1 Current API endpoints

| Endpoint | Method | Purpose | Current status |
|---|---|---|---|
| `/api/weather` | GET | District weather | Functional demo |
| `/api/news` | GET | News/RSS aggregation | Demo / upstream dependent |
| `/api/prices` | GET | Commodity/currency prices | **Hardcoded demo data** |
| `/api/alerts` | GET | Disaster/public alerts | **Hardcoded demo data** |
| `/api/opportunities` | GET | Jobs/scholarships/etc. | **Hardcoded demo data** |
| `/api/trending` | GET | Trending topics | **Hardcoded demo data** |
| `/api/tv-proxy` | GET | Server-side stream proxy | Requires production security review |
| `/api/admin/audit` | GET/POST | Audit log | **In-memory demo implementation** |

---

# 4. EXACTLY where backend/API changes are required

There are two kinds of API references in this repository:

### Type A — internal Next.js APIs

These normally should **not** be changed to an absolute domain.

Example:

```ts
fetch('/api/weather?district=dhaka')
```

This is correct for the same Next.js deployment.

### Type B — external upstream services

These are the URLs you must replace/configure when moving from demo to production.

---

## 4.1 Environment variables

Current file:

```text
.env.example
```

Current variables include:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

### Recommended production `.env.local`

Do not copy secrets into source code.

Example structure:

```env
APP_URL=https://your-domain.com

GEMINI_API_KEY=your_real_key

DATABASE_URL=your_database_connection_string

NEXT_PUBLIC_APP_URL=https://your-domain.com

ADMIN_AUTH_SECRET=your_long_random_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

CRON_SECRET=your_random_cron_secret

NEWS_CACHE_TTL=300
WEATHER_CACHE_TTL=300
```

Only add variables actually used by your implementation.

### Never expose server-only secrets

Do not use:

```text
NEXT_PUBLIC_
```

for:

- database passwords
- service-role keys
- admin secrets
- private API keys
- cron secrets
- server credentials

---

# 5. Backend URL architecture

## Recommended production architecture

```text
User
  │
  ▼
https://your-domain.com
  │
  ├── Next.js frontend
  │
  ├── /api/weather
  ├── /api/news
  ├── /api/prices
  ├── /api/alerts
  ├── /api/opportunities
  ├── /api/trending
  ├── /api/tv-proxy
  │
  └── /api/admin/*
          │
          ▼
      Database
          │
          ├── channels
          ├── sources
          ├── news
          ├── alerts
          ├── opportunities
          ├── prices
          ├── users
          ├── audit_logs
          └── settings
```

For a single Next.js deployment, frontend calls should remain relative:

```ts
fetch('/api/news')
```

Do **not** unnecessarily change this to:

```ts
fetch('https://your-domain.com/api/news')
```

unless you have a specific multi-origin architecture.

---

# 6. Hardcoded demo data that MUST be replaced

Several backend routes currently return arrays defined directly inside the source code.

These include:

```text
app/api/prices/route.ts
app/api/alerts/route.ts
app/api/opportunities/route.ts
app/api/trending/route.ts
```

This means the data is not currently coming from a real database or reliable live data-management system.

---

## 6.1 `/api/prices`

Current behavior:

```text
app/api/prices/route.ts
```

contains hardcoded values for:

- USD/BDT
- SAR/BDT
- AED/BDT
- Gold
- Silver
- Octane
- Diesel
- Rice
- Potato
- Onion
- Eggs
- Chicken

### Production replacement

Create a database table such as:

```text
commodity_prices
```

Suggested fields:

```text
id
slug
name_bn
name_en
unit_bn
unit_en
category
current_price
previous_price
currency
change_percent
source_name
source_url
last_updated
is_active
created_at
updated_at
```

Then change:

```text
GET /api/prices
```

to read from the database.

---

# 7. Alerts production migration

Current file:

```text
app/api/alerts/route.ts
```

contains hardcoded alert objects.

Production implementation should use:

```text
alerts
alert_districts
alert_sources
```

Suggested alert schema:

```text
alerts
---------
id
title_bn
title_en
summary_bn
summary_en
severity
layer
source_id
official_link
issued_at
expires_at
is_active
created_at
updated_at
```

District mapping:

```text
alert_districts
---------------
alert_id
district_id
```

Admin should be able to:

- Create alert
- Edit alert
- Publish alert
- Unpublish alert
- Set severity
- Set affected districts
- Set expiry
- Add official source
- View audit history

---

# 8. Opportunities / jobs production migration

Current file:

```text
app/api/opportunities/route.ts
```

contains hardcoded sample opportunities.

Move these to a database table:

```text
opportunities
```

Suggested schema:

```text
id
title_bn
title_en
organization_bn
organization_en
category
eligibility_bn
location_bn
deadline
benefits_bn
source_name
source_url
apply_url
is_official
is_active
created_at
updated_at
```

Categories already represented by the code include:

```text
job
internship
scholarship
competition
training
```

---

# 9. Trending data production migration

Current file:

```text
app/api/trending/route.ts
```

contains fixed sample values.

Production options:

### Option A — admin-managed trending

Admin enters:

```text
tag
count
category
growth
```

### Option B — automatically generated

Build a scheduled pipeline from approved sources.

Important:

Do not present invented counts as real public sentiment.

If values are manually curated, label them accordingly.

---

# 10. Live TV / HLS system

Main component:

```text
components/LiveTVSection.tsx
```

Client-side legacy version:

```text
client/components/LiveTVSection.tsx
```

There is also:

```text
app/api/tv-proxy/route.ts
```

and:

```text
stream-proxy.js
```

### Important

Only add streams that you are legally authorized to redistribute or proxy.

Do not assume that a publicly accessible `.m3u8` URL gives permission to redistribute it.

For production, each channel should be stored in a database:

```text
channels
--------
id
name
name_bn
logo_url
stream_url
stream_type
category
language
is_live
is_active
sort_order
source_id
created_at
updated_at
```

---

# 11. TV Proxy — critical security requirement

The proxy endpoint is one of the highest-risk parts of this project.

A generic endpoint like:

```text
/api/tv-proxy?url=...
```

can become an **SSRF vulnerability** if arbitrary URLs are accepted.

### Do NOT deploy a fully open proxy.

Production proxy should enforce:

1. HTTPS-only upstream URLs.
2. Allowlisted hostnames.
3. No localhost.
4. No `127.0.0.1`.
5. No private IP ranges.
6. No cloud metadata IPs.
7. No arbitrary ports.
8. No file URLs.
9. No redirects to unapproved hosts.
10. Maximum response size.
11. Timeout.
12. Rate limiting.
13. Request logging.
14. Correct content-type validation.
15. CORS policy.
16. Abuse prevention.

### Better architecture

Instead of:

```text
/api/tv-proxy?url=https://anything.com/file.m3u8
```

prefer:

```text
/api/tv-proxy/channel/channel-id
```

The server retrieves the channel URL from your database.

This means the client cannot supply arbitrary upstream URLs.

---

# 12. Admin system — current status

Admin-related routes/pages include:

```text
app/admin/page.tsx
app/admin/channels/page.tsx
app/admin/sources/page.tsx
app/admin/alerts/page.tsx
app/admin/audit/page.tsx
```

There are also older static admin pages:

```text
admin/index.html
admin/channels.html
admin/sources.html
admin/alerts.html
admin/admin.js
```

### Recommended

Use:

```text
app/admin/*
```

as the official admin application.

Archive/remove the legacy:

```text
admin/*.html
```

after confirming they are unused.

---

# 13. CRITICAL: Admin authentication is not production-ready

The current audit endpoint:

```text
app/api/admin/audit/route.ts
```

accepts POST requests and uses a default:

```text
admin-user
```

when a user ID is not supplied.

That is not sufficient for production authentication.

The audit endpoint must not be considered protected merely because it is under:

```text
/api/admin/
```

### Required production authentication

Use one of:

- Supabase Auth
- Auth.js / NextAuth
- Clerk
- Firebase Authentication
- another properly configured identity provider

For a cost-conscious architecture, Supabase Auth + PostgreSQL is a practical choice.

---

# 14. Admin role system

Recommended roles:

```text
super_admin
admin
editor
moderator
viewer
```

Suggested permissions:

| Permission | Super Admin | Admin | Editor | Moderator | Viewer |
|---|---:|---:|---:|---:|---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Channels | ✅ | ✅ | ❌ | ❌ | 👁 |
| Sources | ✅ | ✅ | ❌ | ❌ | 👁 |
| News | ✅ | ✅ | ✅ | ❌ | 👁 |
| Alerts | ✅ | ✅ | ❌ | ✅ | 👁 |
| Opportunities | ✅ | ✅ | ✅ | ❌ | 👁 |
| Prices | ✅ | ✅ | ✅ | ❌ | 👁 |
| Users | ✅ | ❌/limited | ❌ | ❌ | ❌ |
| Audit logs | ✅ | ✅ | 👁 | 👁 | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ |

Every admin mutation should verify:

```text
authenticated user
+
role
+
permission
```

on the server.

Never rely on hiding UI buttons.

---

# 15. Audit log — current limitation

Current implementation:

```text
lib/auditLogger.ts
```

uses an in-memory JavaScript array.

That means:

- logs can disappear after restart
- logs are not shared reliably across server instances
- serverless deployments may create separate memory states
- logs are not durable
- logs cannot be reliably queried historically

### Production replacement

Create:

```text
audit_logs
```

database table.

Suggested fields:

```text
id
user_id
action
details
severity
ip_address
user_agent
created_at
metadata_json
```

Then write audit logs to the database.

---

# 16. Existing source URLs you should review

The codebase currently contains external source URLs in multiple places.

Important files include:

```text
app/api/news/route.ts
app/api/weather/route.ts
app/api/alerts/route.ts
app/api/opportunities/route.ts
components/LiveTVSection.tsx
client/components/LiveTVSection.tsx
admin/admin.js
api/channels.js
components/AdminDashboardModal.tsx
```

There are also placeholder/demo URLs such as:

```text
example.com
demo.unified-streaming.com
test-streams.mux.dev
picsum.photos
```

These should be removed from production configuration.

---

# 17. Centralize all external APIs

Do not scatter source URLs throughout React components.

Create something like:

```text
config/
  app.ts
  api.ts
  sources.ts
  streams.ts
  features.ts
```

Example:

```ts
export const sourceConfig = {
  weather: {
    provider: 'open-meteo',
    baseUrl: 'https://api.open-meteo.com',
  },
  news: {
    rss: [],
  },
};
```

Better yet, keep secrets and environment-specific values in environment variables while keeping non-secret configuration in typed config files.

---

# 18. Production database recommendation

A strong low-cost stack is:

```text
Frontend + API
    ↓
Next.js
    ↓
Supabase
    ├── PostgreSQL
    ├── Auth
    └── Storage (optional)
```

### Suggested tables

```text
profiles
admin_users / roles
permissions

channels
channel_categories
channel_sources

news_items
news_sources

alerts
alert_districts

opportunities
opportunity_categories

commodity_prices
price_history

weather_cache

trending_topics

audit_logs

app_settings
feature_flags
```

---

# 19. Recommended database relationships

```text
users
  │
  ├── roles
  │
  └── audit_logs

sources
  ├── news_items
  ├── channels
  ├── alerts
  └── opportunities

districts
  └── alert_districts

channels
  └── channel_categories

commodity_prices
  └── price_history
```

---

# 20. Admin dashboard production features

The current UI is an early foundation. Production admin should support:

## Dashboard

- Total channels
- Live channels
- Offline channels
- Active alerts
- News count
- Published opportunities
- API health
- Last synchronization time
- Error count
- Recent admin actions

## Channel management

- Add channel
- Edit channel
- Delete/archive channel
- Enable/disable
- Logo
- Category
- Language
- Stream type
- Stream URL
- Legal/source metadata
- Sort order
- Preview player
- Health check
- Bulk import
- Bulk enable/disable

## Sources

- Add source
- Source type
- Base URL
- RSS URL
- API endpoint
- Active/inactive
- Sync interval
- Last sync
- Last error
- Health status

## Alerts

- Create
- Edit
- Publish
- Expire
- Severity
- Layer
- District targeting
- Official link

## News

- Feed monitoring
- Manual article creation
- Publish/unpublish
- Category
- Source
- Duplicate detection
- Search
- Moderation

## Prices

- Manual update
- Import
- Source tracking
- Historical price
- Change percentage
- Last update

## Opportunities

- Create/edit/delete
- Category
- Deadline
- Official status
- Apply URL
- Expiry
- Search/filter

## Audit

- Admin
- Action
- Timestamp
- IP
- User agent
- Severity
- Metadata
- Search/filter

---

# 21. Data synchronization architecture

For production, do not depend on a user opening the website to trigger all upstream updates.

Recommended:

```text
External sources
      ↓
Scheduled worker / cron
      ↓
Normalize + validate
      ↓
Database
      ↓
Next.js API
      ↓
Frontend
```

Example:

```text
Every 5 minutes
    ↓
Weather sync

Every 5–15 minutes
    ↓
News/RSS sync

Every 15–60 minutes
    ↓
Opportunity sync

As required
    ↓
Alerts

Admin-controlled
    ↓
Prices
```

---

# 22. Cron security

If scheduled endpoints are created, protect them.

Example:

```text
Authorization: Bearer <CRON_SECRET>
```

or platform-native cron authentication.

Never create a public endpoint such as:

```text
/api/sync-news
```

that anyone can invoke repeatedly without authentication.

---

# 23. Caching strategy

Production should use caching to reduce:

- upstream API calls
- RSS load
- server costs
- latency
- rate-limit problems

Recommended approach:

```text
External API
    ↓
Cache
    ↓
Database
    ↓
Next.js API
    ↓
Client
```

Use suitable TTL values.

Example:

```text
Weather: 5–10 minutes
News: 2–5 minutes
Prices: source-dependent
Alerts: very short TTL for critical data
Opportunities: 15–60 minutes
Trending: source-dependent
```

Critical alerts should have a shorter freshness window and a visible timestamp.

---

# 24. Error handling

Every upstream integration should handle:

```text
timeout
HTTP 4xx
HTTP 5xx
invalid JSON
invalid XML/RSS
empty response
rate limit
DNS failure
schema change
partial source failure
```

Do not let one failed source break the entire dashboard.

Return structured errors:

```json
{
  "success": false,
  "error": {
    "code": "UPSTREAM_TIMEOUT",
    "message": "The upstream source did not respond in time."
  }
}
```

Do not leak secrets, internal stack traces, or credentials to users.

---

# 25. Input validation

All API inputs should be validated.

Examples:

```text
district
category
search
channelId
sourceId
alertId
opportunityId
```

Use a schema validator such as Zod if appropriate.

Do not trust:

```text
req.query
req.body
headers
cookies
URL parameters
```

---

# 26. Rate limiting

Production APIs should have rate limits.

Especially:

```text
/api/tv-proxy
/api/admin/*
/api/news
/api/weather
```

Possible architecture:

```text
Cloudflare
    ↓
Rate limiting / WAF
    ↓
Next.js
```

or an application-level Redis-based rate limiter.

---

# 27. Security checklist

Before launch:

- [ ] Admin authentication implemented
- [ ] Server-side authorization implemented
- [ ] Admin APIs protected
- [ ] Audit logs persisted
- [ ] SSRF protection implemented
- [ ] Rate limiting implemented
- [ ] CORS reviewed
- [ ] CSP reviewed
- [ ] Security headers enabled
- [ ] Secrets removed from Git
- [ ] `.env.local` excluded from Git
- [ ] Input validation implemented
- [ ] Output sanitization implemented
- [ ] Error messages sanitized
- [ ] Database RLS / permissions configured
- [ ] Backup strategy configured
- [ ] Recovery procedure tested
- [ ] Dependency vulnerabilities checked
- [ ] Stream licensing verified
- [ ] RSS/API usage terms reviewed

---

# 28. Current `APP_URL`

The project contains:

```text
https://bangladesh-live-hub.org
```

in places such as sharing / metadata-related code.

When production domain changes, search the entire repository for:

```text
bangladesh-live-hub.org
```

and update every intentional production reference.

Prefer a single configuration value rather than hardcoding it repeatedly.

---

# 29. Stream URL management

Stream URLs are currently present in source files such as:

```text
components/LiveTVSection.tsx
client/components/LiveTVSection.tsx
api/channels.js
app/admin/channels/page.tsx
```

This is not ideal.

### Production

Move channels into the database and let the admin dashboard manage them.

Frontend:

```text
GET /api/channels
```

Admin:

```text
POST /api/admin/channels
PATCH /api/admin/channels/:id
DELETE /api/admin/channels/:id
```

Server should return only approved/active channels.

---

# 30. API naming recommendation

For production consistency, standardize API routes.

Recommended:

```text
GET    /api/channels
POST   /api/admin/channels
PATCH  /api/admin/channels/:id
DELETE /api/admin/channels/:id

GET    /api/news
POST   /api/admin/news
PATCH  /api/admin/news/:id
DELETE /api/admin/news/:id

GET    /api/alerts
POST   /api/admin/alerts
PATCH  /api/admin/alerts/:id
DELETE /api/admin/alerts/:id

GET    /api/opportunities
POST   /api/admin/opportunities
PATCH  /api/admin/opportunities/:id
DELETE /api/admin/opportunities/:id

GET    /api/prices
POST   /api/admin/prices
PATCH  /api/admin/prices/:id

GET    /api/trending
GET    /api/weather
GET    /api/tv/channels/:id
GET    /api/admin/audit
```

---

# 31. Project structure

Current important structure:

```text
BANGLADESH-LIVE-HUB--main/
│
├── app/
│   ├── admin/
│   │   ├── alerts/
│   │   ├── audit/
│   │   ├── channels/
│   │   ├── sources/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── admin/
│   │   ├── alerts/
│   │   ├── news/
│   │   ├── opportunities/
│   │   ├── prices/
│   │   ├── trending/
│   │   ├── tv-proxy/
│   │   └── weather/
│   │
│   ├── alerts/
│   ├── my-area/
│   ├── opportunities/
│   ├── prices/
│   ├── profile/
│   ├── tv/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── AdminDashboardModal.tsx
│   ├── AlertMapSection.tsx
│   ├── BreakingNewsSection.tsx
│   ├── LiveTVSection.tsx
│   ├── MyAreaDashboard.tsx
│   ├── OpportunitySection.tsx
│   ├── PriceWatchSection.tsx
│   └── WeatherWidget.tsx
│
├── hooks/
├── lib/
├── public/
│   └── manifest.json
│
├── client/              # legacy/parallel static implementation
├── admin/               # legacy/parallel admin implementation
├── api/                 # legacy API files
│
├── docs/
│   └── ADMIN_ARCHITECTURE.md
│
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── vercel.json
```

---

# 32. Local development

## Requirements

Recommended:

```text
Node.js 20+
npm / pnpm / bun
Git
```

Check:

```bash
node -v
npm -v
```

---

## Install

From the project root:

```bash
npm install
```

or use the package manager already standardized by your team.

The repository includes:

```text
bun.lock
```

so Bun is also an option:

```bash
bun install
```

---

## Environment

Copy:

```text
.env.example
```

to:

```text
.env.local
```

Then fill in the required values.

---

## Run development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 33. Production build

Always test a production build before deployment:

```bash
npm run lint
npm run build
npm run start
```

If lint or build fails, fix it before deployment.

---

# 34. Deployment on Vercel

This project contains:

```text
vercel.json
```

Recommended deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
Next.js build
   ↓
Production domain
```

### Steps

1. Push repository to GitHub.
2. Import repository into Vercel.
3. Select Next.js framework if detected automatically.
4. Configure environment variables.
5. Deploy.
6. Test every `/api/*` endpoint.
7. Test admin authentication.
8. Test HLS playback.
9. Test mobile layout.
10. Configure custom domain.

### Important

Never commit:

```text
.env.local
```

or real secrets.

---

# 35. Deployment on another platform

Because this is a Next.js application, it can also be deployed on platforms supporting Next.js/Node server workloads.

Before choosing a platform, verify support for:

- Next.js App Router
- Server route handlers
- environment variables
- streaming responses if required
- long-running upstream requests
- scheduled jobs / cron
- Web APIs used by the project

Do not assume a static-hosting platform can run:

```text
app/api/*
```

or the TV proxy.

---

# 36. Production architecture recommended for this project

For a professional low-cost deployment:

```text
                    ┌─────────────────────┐
                    │      Cloudflare      │
                    │ DNS / WAF / CDN      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Vercel        │
                    │   Next.js App       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
       Supabase DB       External APIs      Approved TV
       + Auth            / RSS Sources       Stream Sources
             │
             ▼
        Admin System
             │
             ▼
        Audit Logs
```

---

# 37. Production implementation roadmap

## Phase 0 — cleanup

- [ ] Decide Next.js is the only primary application
- [ ] Archive legacy `client/`
- [ ] Archive legacy `admin/`
- [ ] Remove unused `api/`
- [ ] Remove demo URLs
- [ ] Remove fake data
- [ ] Remove duplicated components
- [ ] Run TypeScript check
- [ ] Run lint

---

## Phase 1 — configuration

Create:

```text
config/
  app.ts
  api.ts
  sources.ts
  streams.ts
  features.ts
```

Centralize:

- domain
- branding
- API configuration
- source URLs
- feature flags
- stream configuration

---

## Phase 2 — database

Set up Supabase/PostgreSQL.

Create:

```text
users
roles
channels
sources
news_items
alerts
opportunities
commodity_prices
price_history
trending_topics
audit_logs
app_settings
```

---

## Phase 3 — authentication

Implement:

- Login
- Logout
- Session handling
- Role checking
- Permission checking
- Password reset / recovery
- Admin route protection

---

## Phase 4 — admin APIs

Build secure CRUD APIs.

All mutations must include:

```text
authentication
authorization
validation
audit logging
error handling
```

---

## Phase 5 — real data ingestion

Implement:

```text
News sync
Weather sync
Alert sync
Opportunity sync
Price sync
```

with:

```text
cron
cache
database
retry
logging
deduplication
```

---

## Phase 6 — live TV management

Implement:

```text
Channel CRUD
Channel health
Channel categories
Channel ordering
Stream status
Logo management
Approved proxy targets
```

---

## Phase 7 — security

Complete:

```text
SSRF protection
Rate limits
CSP
CORS
Security headers
Input validation
Auth
RBAC
RLS
Audit
```

---

## Phase 8 — performance

Optimize:

- server-side caching
- client caching
- image optimization
- lazy loading
- code splitting
- API response sizes
- database indexes
- RSS parsing
- stream health checks

---

## Phase 9 — observability

Add:

```text
Error tracking
Structured logs
API latency
Upstream failure rate
TV stream failure rate
Database errors
Admin activity
```

---

## Phase 10 — final launch

Before public launch:

```text
npm run lint
npm run build
npm run start
```

Then run the production checklist below.

---

# 38. Production QA checklist

## Frontend

- [ ] Mobile Chrome
- [ ] Android
- [ ] Desktop Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Slow 4G
- [ ] Offline state
- [ ] Empty state
- [ ] API failure state
- [ ] Long Bengali text
- [ ] English text
- [ ] Accessibility keyboard navigation

## APIs

- [ ] Weather
- [ ] News
- [ ] Prices
- [ ] Alerts
- [ ] Opportunities
- [ ] Trending
- [ ] Channels
- [ ] Admin
- [ ] Audit

## Security

- [ ] Unauthenticated admin request rejected
- [ ] Unauthorized role rejected
- [ ] Invalid input rejected
- [ ] Arbitrary proxy URL rejected
- [ ] Private IP proxy rejected
- [ ] Rate limit tested
- [ ] Secrets not exposed
- [ ] Error stack not exposed

## Data

- [ ] Source attribution
- [ ] Last updated timestamps
- [ ] Expired alerts hidden
- [ ] Expired opportunities hidden
- [ ] Duplicate news removed
- [ ] Invalid source data handled

---

# 39. Monitoring

At minimum monitor:

```text
HTTP 5xx
HTTP 4xx spikes
API latency
External API failures
News sync failures
Weather sync failures
Database connection failures
TV stream failures
Admin login failures
```

Set alerts for repeated failures.

---

# 40. Backups

For production database:

- automated backups
- periodic restore testing
- retention policy
- recovery procedure

A backup that has never been restored/tested should not be considered a verified backup.

---

# 41. SEO

Production should include:

- metadata
- Open Graph
- Twitter/X card metadata
- canonical URLs
- sitemap
- robots.txt
- structured data where applicable
- Bengali and English metadata
- proper page titles
- social share preview

Do not use fake claims such as “live” or “official” unless the data is actually live/official.

---

# 42. PWA

The repository includes:

```text
public/manifest.json
```

Before calling the app production PWA-ready, verify:

- manifest
- icons
- theme color
- service worker strategy
- offline fallback
- installability
- HTTPS
- cache strategy
- update strategy

---

# 43. Sharing

The project contains sharing support for:

- WhatsApp
- Telegram
- Facebook
- native/browser share where supported

Production should generate the canonical URL from configuration rather than hardcoding the domain repeatedly.

---

# 44. Important data integrity warning

Some demo records currently claim official sources and specific values.

Before public launch, every such record must be verified.

Do not publish fabricated:

- government alerts
- job deadlines
- scholarship claims
- salary/benefit claims
- commodity prices
- government notices
- official-source attribution
- trending counts
- live-stream status

If the data is demo data, clearly mark it as:

```text
Demo
Sample
Test data
```

until it is replaced by verified data.

---

# 45. Legal / content compliance

This application may display third-party:

- news
- RSS content
- logos
- images
- TV streams
- weather information
- government information

Before production launch:

1. Verify licensing / permission.
2. Respect source terms.
3. Provide attribution where required.
4. Avoid copying full copyrighted articles.
5. Use official APIs/RSS feeds where permitted.
6. Only redistribute/proxy streams that you are authorized to redistribute.
7. Add a clear Terms / Privacy page.

---

# 46. Recommended production API response standard

Use a consistent structure.

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "updatedAt": "2026-08-11T00:00:00.000Z"
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}
```

Consistency makes frontend development and debugging much easier.

---

# 47. Recommended frontend API layer

Instead of calling APIs everywhere:

```ts
fetch('/api/news')
fetch('/api/weather')
fetch('/api/prices')
```

create:

```text
lib/api/
  client.ts
  news.ts
  weather.ts
  prices.ts
  alerts.ts
  opportunities.ts
  channels.ts
```

Then UI components use typed functions:

```ts
getNews()
getWeather()
getPrices()
getAlerts()
getOpportunities()
getChannels()
```

This makes the project easier to maintain.

---

# 48. Recommended TypeScript model layer

Create:

```text
types/
  news.ts
  weather.ts
  alerts.ts
  channels.ts
  opportunities.ts
  prices.ts
  admin.ts
```

Avoid widespread:

```ts
any
```

The current main page contains several `any`-typed state variables. Production should replace those with explicit interfaces.

---

# 49. Recommended logging

Use structured logging in production.

Avoid logging sensitive values.

Never log:

```text
passwords
API keys
service-role keys
session tokens
cookies
authorization headers
private stream credentials
```

---

# 50. Dependency management

The current project uses modern packages including:

```text
next
react
react-dom
typescript
hls.js
motion
lucide-react
rss-parser
@google/genai
tailwindcss
```

Before release:

```bash
npm audit
```

and review major-version upgrades carefully.

Do not blindly upgrade every dependency immediately before launch.

---

# 51. Git workflow

Recommended branches:

```text
main
develop
feature/*
fix/*
hotfix/*
```

Production:

```text
main → production
```

Feature:

```text
feature/admin-auth
feature/database
feature/channel-manager
```

Use small commits.

Example:

```text
feat: add Supabase channel repository
feat: protect admin routes with RBAC
fix: prevent arbitrary proxy URLs
refactor: centralize source configuration
```

---

# 52. Recommended final folder structure

After production refactor:

```text
app/
├── admin/
├── api/
├── alerts/
├── my-area/
├── opportunities/
├── prices/
├── profile/
├── tv/
└── page.tsx

components/
├── admin/
├── alerts/
├── news/
├── prices/
├── tv/
├── weather/
└── shared/

config/
├── app.ts
├── api.ts
├── features.ts
├── sources.ts
└── streams.ts

lib/
├── api/
├── auth/
├── db/
├── security/
├── cache/
├── validation/
└── utils/

types/
├── alerts.ts
├── channels.ts
├── news.ts
├── opportunities.ts
├── prices.ts
└── weather.ts

supabase/
├── migrations/
└── seed/

docs/
├── README.md
├── ADMIN_ARCHITECTURE.md
├── API.md
├── DATABASE.md
├── DEPLOYMENT.md
└── SECURITY.md
```

---

# 53. Quick reference: what you need to change first

If you want to take this project from demo to production, prioritize in this order:

### 🔴 Critical

1. Replace hardcoded admin/data APIs.
2. Implement real database.
3. Implement admin authentication.
4. Implement server-side RBAC.
5. Protect `/api/admin/*`.
6. Fix audit logging persistence.
7. Lock down `/api/tv-proxy`.
8. Remove arbitrary proxy behavior.
9. Validate all inputs.
10. Verify legal authorization for every stream.

### 🟠 High priority

11. Centralize external API configuration.
12. Replace fake/demo data.
13. Add scheduled synchronization.
14. Add caching.
15. Add rate limiting.
16. Add source health monitoring.
17. Add error tracking.
18. Add backups.
19. Add security headers.
20. Add production SEO/PWA checks.

### 🟢 Quality

21. Remove duplicated legacy code.
22. Replace `any` with TypeScript types.
23. Add automated tests.
24. Improve API response consistency.
25. Add documentation.
26. Add CI/CD.
27. Add staging environment.

---

# 54. Demo → Production checklist

```text
DEMO
  ↓
Hardcoded data
  ↓
Local/in-memory state
  ↓
No real auth
  ↓
Open/weak proxy
  ↓
Static URLs
  ↓
Manual testing
  ↓
PRODUCTION
  ↓
Database
  ↓
Authentication + RBAC
  ↓
Validated APIs
  ↓
Secure allowlisted proxy
  ↓
Scheduled sync
  ↓
Cache + rate limit
  ↓
Monitoring + logs
  ↓
Backups
  ↓
Automated tests
  ↓
Staging
  ↓
Production
```

---

# 55. Definition of “Production Ready”

Bangladesh Live Hub should only be considered production-ready when:

- [ ] Real database is connected
- [ ] Real authentication is connected
- [ ] Admin RBAC is enforced server-side
- [ ] All admin mutations are audited
- [ ] Audit logs survive deployment/restart
- [ ] All demo data is removed or explicitly labeled
- [ ] External source permissions are verified
- [ ] News/RSS ingestion is compliant
- [ ] TV stream redistribution is authorized
- [ ] TV proxy is allowlisted and SSRF-safe
- [ ] API rate limiting is active
- [ ] Secrets are stored securely
- [ ] Database backup is configured
- [ ] Monitoring is active
- [ ] Error tracking is active
- [ ] Production build passes
- [ ] Mobile QA passes
- [ ] Accessibility QA passes
- [ ] SEO/PWA checks pass
- [ ] Disaster recovery has been tested

---

# 56. Final recommendation

The current codebase is a **good UI/product prototype**, but it should not be treated as a finished backend system.

The strongest path is:

```text
Next.js
+
Supabase PostgreSQL
+
Supabase Auth
+
Server-side RBAC
+
Scheduled data ingestion
+
Cloudflare/WAF
+
Secure allowlisted stream gateway
+
Persistent audit logs
+
Monitoring
```

Keep the frontend experience, but move the application's truth out of hardcoded React/API arrays and into a secure backend/database.

The most important engineering principle for the next stage is:

> **The browser should never be trusted with authority.**

Channel management, source management, alerts, prices, opportunities, admin permissions, stream proxying, and audit logging must all be enforced on the server.

---

## Maintainer notes

Before changing the architecture, make a Git tag/branch:

```bash
git checkout -b production-hardening
```

Then implement changes in small, testable stages.

Recommended order:

```text
1. Database
2. Auth
3. RBAC
4. Admin API
5. Persistent audit
6. Channel management
7. Data sync
8. Secure TV gateway
9. Caching
10. Rate limiting
11. Monitoring
12. QA
13. Production deployment
```

**Do not delete the legacy `client/`, `admin/`, or `api/` directories until you have confirmed they are no longer used by the deployment or another workflow.**
