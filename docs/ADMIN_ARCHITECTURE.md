# Bangladesh Live Information Hub (বাংলাদেশ লাইভ হাব)
## System & Admin Panel Architecture Specification (v2.0)

This document specifies the full system architecture, API route definitions, Role-Based Access Control (RBAC) matrix, Cloudflare Edge proxy implementation, Supabase/PostgreSQL schema, and implementation roadmap for the **Bangladesh Live Information Hub** and its dedicated **Control Center (Admin Panel)**.

---

## 1. System Architecture Overview

The system consists of three decoupled layers:

```
[ Client / Web Application ]  <--->  [ Cloudflare Edge Worker ]  <--->  [ Public / Authorized HLS Streams ]
         |
         | (Auth, Content, Admin APIs)
         v
[ Next.js API Routes / App Router ]
         |
         v
[ Supabase PostgreSQL Database ]
```

### 1.1 Mobile-First Live IPTV Platform
* **Player Core (`TVPlayer.tsx`)**: Built using `hls.js` with dynamic latency configuration, adaptive bit-rate switching, and automatic health monitoring.
* **Stream Proxy Strategy**: Video stream traffic bypasses the application server entirely to maintain zero backend bandwidth cost and minimal latency. HTTP-to-HTTPS conversion and CORS header injection are performed on Cloudflare's Edge network.
* **Fallback & Redundancy**: Streams support primary and backup URLs with automated health checks that automatically reroute client traffic if a primary stream fails.

### 1.2 Unified Web-Based Control Center (Admin Panel)
* **Single Repository & Backend**: Built within the same Next.js App Router codebase under the `/admin` path namespace to share database clients, TypeScript interfaces, and middleware without code duplication.
* **Server Authorization**: Every route under `/api/admin/*` is guarded by server-side authorization middleware that validates JWT session tokens and checks role permissions against the RBAC ledger.

---

## 2. Supabase / PostgreSQL Database Schema

```sql
-- Core Admin & RBAC Tables
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id UUID REFERENCES admin_roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Channels & Streams Tables
CREATE TABLE IF NOT EXISTS tv_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(100) UNIQUE NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'NEWS',
    language VARCHAR(30) DEFAULT 'bn',
    country VARCHAR(10) DEFAULT 'BD',
    epg_id VARCHAR(100),
    website_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    is_featured BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS channel_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES tv_channels(id) ON DELETE CASCADE,
    stream_type VARCHAR(20) NOT NULL CHECK (stream_type IN ('hls', 'dash', 'mp4', 'embed')),
    stream_url TEXT NOT NULL,
    backup_stream_url TEXT,
    use_proxy BOOLEAN DEFAULT true,
    user_agent TEXT,
    referer_url TEXT,
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS channel_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES tv_channels(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES channel_streams(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('ONLINE', 'SLOW', 'OFFLINE', 'DISABLED')),
    response_time_ms INT,
    status_code INT,
    error_type TEXT,
    failure_count INT DEFAULT 0,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ
);

-- Data Sources & Automation Jobs
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('NEWS_API', 'RSS', 'WEATHER_API', 'GOV_OPEN_DATA', 'SPORTS_API', 'OPPORTUNITY_SOURCE', 'EPG_SOURCE')),
    endpoint_url TEXT NOT NULL,
    update_interval_mins INT DEFAULT 15,
    is_enabled BOOLEAN DEFAULT true,
    rate_limit_per_min INT,
    last_success_at TIMESTAMPTZ,
    last_error_at TIMESTAMPTZ,
    last_error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS source_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED')),
    items_processed INT DEFAULT 0,
    items_rejected INT DEFAULT 0,
    duration_ms INT,
    error_log TEXT,
    ran_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings & Feature Flags
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Role-Based Access Control (RBAC) Matrix

Permissions are stored as JSONB objects in `admin_roles.permissions`.

| Permission Area | SUPER_ADMIN | ADMIN | EDITOR | MODERATOR | DATA_MANAGER | CHANNEL_MANAGER | ANALYST |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Settings** | Full | View | - | - | - | - | View |
| **User & Role Management** | Full | View | - | - | - | - | - |
| **Audit Logs** | Full | View | - | - | - | - | View |
| **TV Channels & Streams** | Full | Full | View | View | - | Full | View |
| **Stream Health Monitoring** | Full | Full | View | - | - | Full | View |
| **M3U / EPG Sync** | Full | Full | - | - | - | Full | - |
| **Data Sources & Automation**| Full | Full | - | - | Full | - | View |
| **Content Moderation (News/Alerts)** | Full | Full | Full | Full | View | - | View |
| **Opportunities Management** | Full | Full | Full | Full | View | - | View |
| **Analytics Dashboard** | Full | Full | Full | Full | Full | Full | Full |

---

## 4. API Route Documentation (`/api/admin/*`)

All admin routes require `Authorization: Bearer <JWT_TOKEN>` or a secure httpOnly cookie session.

### 4.1 Authentication & Profile
* `POST /api/admin/auth/login`: Authenticate admin credentials and return secure JWT token.
* `POST /api/admin/auth/logout`: Revoke active session.
* `GET /api/admin/auth/me`: Fetch authenticated user profile & permissions.

### 4.2 Dashboard & Analytics
* `GET /api/admin/dashboard/metrics`: Summary stats (Total Channels, Active Streams, Health %, Data Sources Status, Active Alerts).
* `GET /api/admin/dashboard/analytics`: Traffic stats, API throughput, and ingestion rates.

### 4.3 Live TV & Channels
* `GET /api/admin/channels`: List channels with status filters.
* `POST /api/admin/channels`: Create new TV channel entry.
* `PUT /api/admin/channels/[id]`: Update channel details or status.
* `DELETE /api/admin/channels/[id]`: Soft delete or archive channel.
* `GET /api/admin/streams`: Fetch stream configurations.
* `POST /api/admin/streams`: Add or pair primary/backup streams to a channel.
* `POST /api/admin/streams/check-health`: Trigger immediate HLS stream ping & health verification.

### 4.4 Data Sources & Collectors
* `GET /api/admin/sources`: List RSS, Gov, Weather, and News APIs.
* `POST /api/admin/sources`: Add or edit data source endpoints.
* `POST /api/admin/sources/[id]/trigger`: Execute collector job manually ("Run Now").

### 4.5 Content Moderation
* `GET /api/admin/content/news`: Paginated list of raw and verified news.
* `PATCH /api/admin/content/news/[id]`: Edit headline, category, location tag, or publish status.
* `POST /api/admin/content/alerts`: Create division/district level emergency alerts.
* `POST /api/admin/content/opportunities`: Create or update job/scholarship notices.

### 4.6 Audit Logs & Security
* `GET /api/admin/audit-logs`: Paginated history of administrative modifications.
* `GET /api/admin/users`: List admin accounts and roles.
* `POST /api/admin/users`: Invite or provision new admin user.

---

## 5. Cloudflare Edge Worker (`stream-proxy.js`)

This Edge Worker converts HTTP HLS video manifests and segments into HTTPS and appends CORS headers directly at Cloudflare Edge locations.

```javascript
/**
 * Cloudflare Edge Proxy for Authorized HLS Streams
 * Path: stream-proxy.js
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Referer',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const targetUrlParam = url.searchParams.get('url');

    if (!targetUrlParam) {
      return new Response(JSON.stringify({ error: 'Missing "url" query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const targetUrl = new URL(targetUrlParam);
      
      // Optional custom headers passed via query params
      const customUserAgent = url.searchParams.get('ua') || 'BDLiveHub-IPTV/2.0';
      const customReferer = url.searchParams.get('referer') || targetUrl.origin;

      const proxyRequestHeaders = new Headers();
      proxyRequestHeaders.set('User-Agent', customUserAgent);
      proxyRequestHeaders.set('Referer', customReferer);
      proxyRequestHeaders.set('Accept', '*/*');

      const originResponse = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: proxyRequestHeaders,
      });

      const responseHeaders = new Headers(originResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      responseHeaders.set('Cache-Control', 'public, max-age=10');

      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy Request Failed', details: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
```

---

## 6. Deployment & Configuration Guide

### 6.1 Cloudflare Edge Worker Deployment
1. Log in to your Cloudflare Dashboard and navigate to **Workers & Pages**.
2. Click **Create Worker** and name it `bdlivehub-stream-proxy`.
3. Copy the code from `stream-proxy.js` into the Worker editor.
4. Deploy to production (e.g., `https://bdlivehub-proxy.workers.dev`).
5. Set the environment variable in `.env.example` / Next.js server runtime:
   ```env
   NEXT_PUBLIC_CLOUDFLARE_PROXY_URL=https://bdlivehub-proxy.workers.dev/?url=
   ```

### 6.2 Next.js & Supabase Configuration
1. Run the database migration script (`001_admin_system_schema.sql`) inside your Supabase SQL Editor.
2. Ensure environment variables are set in `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-super-secret-jwt-key
   NEXT_PUBLIC_CLOUDFLARE_PROXY_URL=https://bdlivehub-proxy.workers.dev/?url=
   ```

---

## 7. Implementation Roadmap

1. **Phase 1**: Approval of `docs/ADMIN_ARCHITECTURE.md` (Current Step).
2. **Phase 2**: Database schema migration script and Supabase client setup.
3. **Phase 3**: Live TV Player (`TVPlayer.tsx`) & Public `/tv` route integration with category filtering.
4. **Phase 4**: Admin Panel Authentication, Layout, RBAC Middleware & Control Center Dashboard (`/admin`).
5. **Phase 5**: Channel & Stream Management UI (`/admin/tv`), Health Monitoring, & Sources Scheduler (`/admin/sources`).
6. **Phase 6**: Content Moderation (News, Emergency Alerts, Opportunities) & System Settings.
