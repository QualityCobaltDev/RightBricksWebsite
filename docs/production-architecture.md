# RightBricks Production Architecture (Cambodia-First, VPS-First)

## 1) Product Architecture Summary

RightBricks is a two-sided + B2B2C marketplace centered on Cambodia, with Phnom Penh as the launch market, and designed to support:

- **Demand side**: buyers, renters
- **Supply side**: landlords, owners, agents, agencies, developers
- **Operations**: moderators, support staff, super admins

Core product pillars:

1. **Discover**: high-quality search, faceted filtering, map + polygon search, multilingual listing content (English/Khmer), SEO-first index pages.
2. **Trust**: verification badges, moderation workflows, listing quality scoring, anti-fraud monitoring, audit trails.
3. **Transact/Lead**: inquiry pipelines, saved searches, alerts, call/message intent capture, CRM-lite for supply users.
4. **Operate**: admin + CMS tooling for content governance, taxonomy, policy, support, and incident response.
5. **Grow**: analytics instrumentation, funnel reporting, city-level expansion model (Phnom Penh → nationwide Cambodia).

Product model by launch phases:

- **Phase 1 (VPS single node)**: listing discovery, lead capture, account roles, moderation, SEO pages, CMS articles.
- **Phase 2**: advanced agent CRM, paid placements, recommendation ranking, event-driven notifications.
- **Phase 3**: multi-node split (app/search/media/workers), regionalization, higher-availability DB.

---

## 2) System Architecture Diagram (Text)

```text
[Web/Mobile Browser]
      |
      | HTTPS (TLS)
      v
[Nginx on Ubuntu 24.04 VPS]
  - rightbricks.online vhost
  - Redirect :80 -> :443
  - Reverse proxy to Next.js
  - Static/cache headers
      |
      v
[Next.js App Router (Node.js, TypeScript)]
  - SSR/ISR pages (SEO-critical)
  - Server Actions + Route Handlers
  - Auth/RBAC enforcement
  - API boundary for clients
      |
      +--------------------+
      |                    |
      v                    v
[PostgreSQL 16]       [Redis (optional early, recommended)]
  - OLTP data          - cache/session/rate-limits/queues
  - Prisma ORM
      |
      v
[Search Engine]
  - OpenSearch (preferred) or Meilisearch fallback
  - faceted + geo + polygon queries
  - denormalized listing index

[Object Storage]
  - S3-compatible bucket for images/docs
  - private originals + public derivatives
  - signed upload URLs

[Background Worker Process]
  - image processing
  - search indexing jobs
  - email/notification jobs
  - moderation scoring jobs

[Observability Stack]
  - structured app logs
  - Nginx access/error logs
  - metrics (node exporter + postgres exporter)
  - uptime + alerting
```

---

## 3) Information Architecture / Sitemap

### Public

- `/` home (Cambodia overview, featured listings)
- `/buy`
- `/rent`
- `/new-projects`
- `/agents`
- `/agencies`
- `/developers`
- `/locations`
  - `/locations/phnom-penh`
  - `/locations/{province}`
  - `/locations/{province}/{district}`
- `/search` (map + filters)
- `/listing/{slug}-{id}`
- `/project/{slug}-{id}`
- `/guides`
- `/guides/{slug}`
- `/about`
- `/contact`
- `/pricing` (for supply-side tools)
- `/help`
- `/privacy`
- `/terms`
- `/robots.txt`
- `/sitemap.xml`

### Authenticated User Areas

- `/account`
- `/account/saved`
- `/account/alerts`
- `/account/inquiries`
- `/account/profile`

### Supply Portal (owner/agent/agency/developer)

- `/portal`
- `/portal/listings`
- `/portal/listings/new`
- `/portal/listings/{id}/edit`
- `/portal/inquiries`
- `/portal/analytics`
- `/portal/team` (agency/developer)
- `/portal/billing`

### Ops Backoffice

- `/admin`
- `/admin/moderation`
- `/admin/listings`
- `/admin/users`
- `/admin/agencies`
- `/admin/developers`
- `/admin/cms`
- `/admin/seo`
- `/admin/analytics`
- `/admin/audit`
- `/admin/support`
- `/admin/settings`

---

## 4) Domain-Driven Module Breakdown

Bounded contexts/modules:

1. **Identity & Access**
   - users, sessions, MFA, RBAC, role grants, policy checks.
2. **Profile & Organization**
   - person profiles, agency/developer orgs, team members.
3. **Listing Catalog**
   - residential/commercial listing entities, metadata, media, amenities.
4. **Project Catalog**
   - new developments, unit plans, developer linkage.
5. **Location Intelligence**
   - provinces/districts/communes, geo polygons, map tiles, geocoding.
6. **Search & Discovery**
   - faceting, ranking, query understanding, indexing pipeline.
7. **Lead & Inquiry**
   - inquiry capture, routing rules, anti-spam, response SLA tracking.
8. **Moderation & Trust**
   - content review queues, verification, fraud signals, takedown actions.
9. **CMS & SEO**
   - guides/blog, landing pages, metadata, sitemap rules.
10. **Billing & Plans (phase 2)**
   - subscriptions, boosts, invoices.
11. **Notifications**
   - email/SMS/push templates, delivery logs.
12. **Analytics & Experimentation**
   - event tracking, funnels, attribution, A/B primitives.
13. **Support Operations**
   - tickets, account interventions, canned responses.
14. **Audit & Compliance**
   - immutable logs, admin action histories, retention policies.

---

## 5) Route Map (Next.js App Router)

- `app/(public)/page.tsx` -> home
- `app/(public)/buy/page.tsx`
- `app/(public)/rent/page.tsx`
- `app/(public)/search/page.tsx`
- `app/(public)/listing/[slug]/page.tsx`
- `app/(public)/project/[slug]/page.tsx`
- `app/(public)/locations/[...segments]/page.tsx`
- `app/(public)/guides/page.tsx`
- `app/(public)/guides/[slug]/page.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(app)/account/*`
- `app/(portal)/portal/*`
- `app/(admin)/admin/*`

API/Route handlers:

- `app/api/auth/*`
- `app/api/listings/*`
- `app/api/projects/*`
- `app/api/search/*`
- `app/api/inquiries/*`
- `app/api/media/*`
- `app/api/admin/*`
- `app/api/webhooks/*`

SEO rendering policy:

- SSR for listing/project detail and high-value location pages.
- ISR for guide pages and semi-static landing pages.
- Edge caching via Nginx for anonymous GET pages.

---

## 6) User Roles & Permissions Model

Role matrix (high-level):

- **Buyer/Renter**
  - view listings, save favorites, create alerts, send inquiries.
- **Owner/Landlord**
  - create/manage own listings, view inquiries for owned listings.
- **Agent**
  - manage assigned listings, respond to inquiries, manage profile.
- **Agency Admin**
  - manage organization profile, team, listings, performance dashboards.
- **Developer Admin**
  - manage projects, units, team roles, project inquiries.
- **Moderator**
  - review/approve/reject listings, enforce trust policies.
- **Support Staff**
  - account assistance, inquiry mediation, limited content edits.
- **Super Admin**
  - full system controls, billing config, policy, role grants.

Permission implementation:

- RBAC base + scoped permissions (`resource:action`), e.g.:
  - `listing:create`, `listing:update:own`, `listing:update:org`, `listing:publish`
  - `admin:moderation:review`, `admin:users:suspend`
- Enforced in server actions/API layer, never client-only.
- Critical operations require elevated checks + audit record.

---

## 7) Service Boundaries (Modular Monolith First)

Single deployable Next.js + worker processes, separated internally by modules:

- `identity-service`
- `listing-service`
- `project-service`
- `search-service`
- `inquiry-service`
- `cms-service`
- `admin-service`
- `analytics-service`

Boundary rules:

- Modules communicate via typed application services/events, not direct table coupling where avoidable.
- Shared kernel: user IDs, org IDs, listing IDs, geo IDs.
- Event outbox pattern for cross-module consistency and external indexing.

Scale path:

- Extract search/indexing and media processing first.
- Extract inquiries/notifications second.
- Keep read models denormalized for performance.

---

## 8) Data Flow Summary

### Listing Publish Flow
1. Supply user creates listing draft.
2. Media uploaded to object storage via signed URL.
3. Listing submitted for moderation.
4. Moderator approves/rejects.
5. On approval, listing state set to `published`.
6. Search indexing job pushes denormalized document.
7. Listing appears on SEO pages and `/search`.

### Inquiry Flow
1. Buyer/renter sends inquiry.
2. Anti-spam + rate-limit checks.
3. Inquiry stored in PostgreSQL.
4. Routed to responsible agent/owner/agency queue.
5. Notification dispatched.
6. Activity logged for analytics and SLA.

### Content (CMS) Flow
1. Editor drafts guide page.
2. Reviewer approves and publishes.
3. ISR revalidate trigger.
4. Sitemap/feeds updated.

---

## 9) Search Architecture

Engine: **OpenSearch** recommended for advanced geo polygons and faceting.

Index strategy:

- `listing_index_v1`
- denormalized fields: title, description, propertyType, listingType, bedrooms, bathrooms, priceUsd, priceKhrApprox, area, amenities, locality hierarchy, geo_point, geo_shape, verification, publishDate.

Capabilities:

- Full-text + typo tolerance.
- Facets: price bands, property type, beds, baths, furnishing, amenities, verified.
- Geo radius + bounding box + polygon map draw.
- Sort: relevance, newest, price asc/desc.

Query pipeline:

- Pre-filter by status/location visibility.
- Rank by textual relevance + freshness + quality score + engagement priors.
- Post-filter for policy/legal constraints.

Reindexing:

- outbox -> queue -> index worker
- nightly consistency reconciliation job.

---

## 10) Admin Architecture

Backoffice at `/admin` with domain-specific consoles:

- moderation queue
- listing/project lifecycle controls
- user/org lifecycle management
- SEO controls (meta templates, noindex rules)
- fraud/risk dashboard
- support tools (account lookup, inquiry interventions)
- audit viewer

Admin hardening:

- mandatory 2FA for admins.
- IP allowlist option for super admin endpoints.
- just-in-time privileged actions for destructive changes.

---

## 11) CMS Architecture

Hybrid CMS model (inside core app):

- content types: `GuideArticle`, `NeighborhoodPage`, `FAQ`, `Announcement`.
- localized fields: `title_en`, `title_km`, `body_en`, `body_km`.
- editorial workflow: draft -> in_review -> scheduled/published -> archived.
- versioning + rollback.
- slug governance and canonical URL enforcement.

SEO outputs from CMS:

- structured data blocks (Article, BreadcrumbList)
- Open Graph/Twitter metadata
- auto sitemap inclusion

All canonical/content URLs use `https://rightbricks.online` in production.

---

## 12) Analytics Architecture

Two-layer analytics:

1. **Product analytics events** (first-party):
   - page views, search events, filter usage, listing clicks, inquiry submit, save listing.
2. **Operational BI**:
   - listing publication time, moderation SLA, inquiry response rate, conversion by source.

Storage:

- canonical event stream table in PostgreSQL (partitioned monthly).
- daily aggregation jobs for dashboards.

KPIs by stage:

- top funnel: organic sessions, listing impressions.
- mid funnel: detail CTR, save rate.
- bottom funnel: inquiry rate, qualified lead rate, reply SLA.

---

## 13) Security Architecture

- HTTPS-only at `https://rightbricks.online`.
- HSTS enabled after certificate validation.
- Secure headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- Session security: httpOnly, secure cookies, rotation on privilege change.
- Passwords hashed with Argon2id.
- Optional social auth can be added later.
- Rate limits at Nginx + app-level for auth and inquiry endpoints.
- CSRF protection for state-changing browser requests.
- Input validation with schema guards.
- Object storage private bucket + signed access for sensitive media.
- Audit logs for admin/moderator actions.
- Automated backup encryption at rest.
- Secret management via environment variables only.

---

## 14) VPS Deployment Architecture (Ubuntu 24.04)

Deployment model: **Docker Compose on single VPS** (consistent prod baseline).

Services on host:

- `nginx` (host-level)
- `rightbricks-app` (Next.js container)
- `rightbricks-worker` (job worker container)
- `postgres` (container or managed external; for phase 1 containerized with persistent volume)
- `redis` (optional but recommended)
- `opensearch` (optional on same VPS initially if resources allow; else managed/external)

Ubuntu 24.04 baseline:

- create deploy user
- install Docker + Compose plugin
- install Nginx + Certbot
- configure systemd unit for compose auto-restart

Nginx reverse proxy (production hostnames only):

- server_name `rightbricks.online www.rightbricks.online`
- redirect `www.rightbricks.online` -> `https://rightbricks.online`
- proxy pass to app container on internal port
- gzip/brotli, cache headers for static assets

Let's Encrypt SSL:

- issue cert for `rightbricks.online` and `www.rightbricks.online`
- auto-renew with systemd timer

UFW firewall:

- allow OpenSSH
- allow 80/tcp
- allow 443/tcp
- deny all other inbound ports

---

## 15) Recommended Repo / Folder Structure

```text
rightbricks/
  app/
    (public)/
    (auth)/
    (app)/
    (portal)/
    (admin)/
    api/
  src/
    modules/
      identity/
      listings/
      projects/
      inquiries/
      search/
      cms/
      admin/
      analytics/
      notifications/
    shared/
      auth/
      db/
      rbac/
      i18n/
      validation/
      logging/
      events/
  prisma/
    schema.prisma
    migrations/
  worker/
    jobs/
    queues/
  config/
    env/
      .env.example
  infra/
    docker/
    nginx/
    systemd/
    scripts/
  docs/
    architecture/
    deployment/
    runbooks/
```

---

## 16) Production Infrastructure Layout (Nginx + App + PostgreSQL + Object Storage)

### Network & Runtime

- Public internet -> Nginx (`:80`, `:443`) on VPS `207.180.207.22`.
- Nginx routes to app container via private bridge network.
- PostgreSQL exposed only internally (no public bind).
- Redis/Search internal only.

### Data stores

- PostgreSQL primary transactional store.
- Search index for discovery read model.
- Object storage for media (S3-compatible recommended):
  - bucket naming strategy: `rightbricks-prod-media`
  - key prefixes by entity (`listing/`, `project/`, `profile/`)
  - lifecycle policies for derivatives/thumbnails.

### Backups

- DB: nightly `pg_dump` + weekly base backup + WAL archiving (phase 2).
- Object storage: versioning + lifecycle + periodic inventory checks.
- Off-VPS backup target required (secondary region/provider).

### Logging & Monitoring

- Nginx logs + app JSON logs + worker logs.
- health endpoints `/api/health/live` and `/api/health/ready`.
- alerting for downtime, disk usage, DB connections, 5xx spikes.

---

## 17) Rollout & Go-Live Plan for rightbricks.online

### DNS

- `A` record: `rightbricks.online` -> `207.180.207.22`
- `A` record: `www.rightbricks.online` -> `207.180.207.22`
- optional `AAAA` record: `rightbricks.online` -> `2a02:c207:2313:3086::1`
- optional `AAAA` record: `www.rightbricks.online` -> `2a02:c207:2313:3086::1`

### Pre-live checklist

1. Environment variables set (DB URL, auth secret, SMTP/API keys, storage creds).
2. Database migrated successfully.
3. SSL certificate active for `rightbricks.online`.
4. Canonical URL and metadata validated to `https://rightbricks.online` only.
5. `robots.txt` and `sitemap.xml` point to `https://rightbricks.online`.
6. UFW active with only SSH/80/443.
7. Backups scheduled and restore test completed.
8. Monitoring and uptime alerts enabled.
9. Admin 2FA enforced.
10. Performance smoke test run on core flows.

### Launch steps

1. Deploy release candidate to production VPS.
2. Run DB migrations.
3. Warm critical pages and search index caches.
4. Enable public traffic.
5. Verify core user journeys (search, detail, inquiry, portal login).
6. Monitor first 24h with elevated alert sensitivity.

### Post-launch operations

- Daily: error/latency review, moderation queue check, inquiry delivery audit.
- Weekly: backup validation, dependency patching, SEO index review.
- Monthly: security review, role audit, cost/performance optimization.

### Restart, Logging, Update Runbook (Ubuntu 24.04 VPS)

- Restart app stack: `docker compose up -d --build`
- Restart Nginx: `sudo systemctl restart nginx`
- View compose logs: `docker compose logs -f app worker`
- View Nginx logs: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- Update cycle:
  1. pull latest code
  2. build images
  3. run migrations
  4. rolling restart containers
  5. smoke test
  6. monitor

