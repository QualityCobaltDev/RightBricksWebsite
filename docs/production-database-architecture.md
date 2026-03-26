# RightBricks Production Database Architecture (PostgreSQL + Prisma)

## 1) Entity Relationship Summary

Core domains and relationship hubs:

- **Identity & access**: `User` ↔ `UserRole` ↔ `Role` ↔ `RolePermission` ↔ `Permission`.
- **Organization model**: `Organization` ↔ `OrganizationMember` ↔ `User`.
- **Persona profiles**: 1:1 from `User` to `AgentProfile`, `OwnerProfile`, `SeekerProfile`.
- **Geography**: `Country` -> `Province` -> `District` -> `Commune`; listings/projects attach to geo IDs.
- **Listings**: `Listing` has multilingual `ListingTranslation`, media (`ListingMedia`), amenities (`ListingAmenity`), and inquiries (`Inquiry`).
- **Projects**: `Project` has multilingual `ProjectTranslation`, media (`ProjectMedia`), and unit configurations (`ProjectUnitType`).
- **User engagement**: `SavedListing`, `SearchAlert`, and `Inquiry` support seeker workflows.
- **Operations**: `ModerationAction`, `VerificationRequest`, `AuditLog` provide trust, compliance, and traceability.
- **Content**: `CmsArticle` + `CmsArticleTranslation` for English/Khmer publishing.

## 2) Full Prisma Schema

The full production Prisma schema code is implemented in:

- `prisma/schema.prisma`

It is configured for PostgreSQL via `DATABASE_URL`, with strict enums, RBAC tables, multilingual content models, listing/project catalogs, moderation/audit tables, and soft-delete columns on mutable entities.

## 3) Enum Definitions

The schema includes production enums for consistency and validation:

- User and access: `UserStatus`, `RoleCode`, `VerificationStatus`, `MembershipStatus`
- Organization: `OrganizationType`, `OrganizationStatus`
- Marketplace: `ListingType`, `ListingStatus`, `PropertyType`, `FurnishingLevel`, `TenureType`, `PricePeriod`, `PublishChannel`
- Lead pipeline: `InquiryStatus`, `InquirySource`
- Media and content: `MediaType`, `ArticleStatus`, `LocaleCode`
- Compliance: `ModerationDecision`, `AuditActorType`, `AuditSeverity`

## 4) Relation Explanations

- **User to organization**: many-to-many through `OrganizationMember` with `status` and `isPrimaryContact`.
- **User to roles**: many-to-many through `UserRole`, with optional `grantedBy` for delegation trail.
- **Listing ownership model**:
  - `ownerId` supports individual owners/landlords.
  - `organizationId` supports agencies/developers.
  - `creatorId` and `updaterId` preserve provenance.
- **Localized text strategy**:
  - `ListingTranslation`, `ProjectTranslation`, and `CmsArticleTranslation` enforce one row per locale via composite unique constraints.
- **Inquiry routing**:
  - Optional links to `Listing` or `Project`.
  - Optional `assignedToId` for support/agent assignment.
- **Moderation/Audit**:
  - `ModerationAction` logs decisions by moderator.
  - `AuditLog` stores before/after JSON snapshots for critical actions.

## 5) Indexing Strategy

High-impact indexes included in schema:

- **User/Auth**: email/phone unique, status/verification indexes, session token unique and expiry indexes.
- **Listing discovery**:
  - status + listingType + deletedAt
  - location composites (`provinceId`, `districtId`, `communeId`)
  - price/status and beds/baths/status
  - lat/lng index for map pre-filtering
  - publishedAt for freshness ordering
- **Inquiry ops**: status + createdAt, assignment/status, anti-spam scores.
- **CMS**: status + publishedAt and category + status.
- **Audit**: actor/time, entity/time, action/time, severity/time.

Note: geo/polygon production search remains in OpenSearch; PostgreSQL indexes support transactional and fallback filters.

## 6) Constraints and Validation Rules

- Unique identity constraints: user email (`citext`), phone, slugs, session token hash.
- Composite uniqueness:
  - translation tables (`[entityId, locale]`)
  - join tables (`[userId, roleId]`, `[listingId, amenityId]`, `[userId, listingId]`)
  - location uniqueness by scope (`provinceId + code`, etc.)
- Monetary fields use Decimal precision (`14,2` or higher) for USD/KHR safety.
- Lat/lng precision stored as `Decimal(10,7)`.
- Nullable FK strategy uses `SetNull` where historical integrity must survive account/listing lifecycle changes.

## 7) Soft Delete / Archive Logic

Soft-delete columns (`deletedAt`) are present on mutable, user-generated entities:

- `User`, `Organization`, profile tables, `Listing`, `ListingMedia`, `Project`, `ProjectMedia`, `Inquiry`, `SearchAlert`, `CmsArticle`.

Archive fields (`archivedAt`) preserve publish lifecycle for long-lived content objects:

- `Listing`, `Project`, `CmsArticle`.

Operational rule:

- Reads for public endpoints always enforce `deletedAt IS NULL` and published status.
- Backoffice endpoints can query archived/deleted datasets for compliance and support.

## 8) Audit Log Approach

`AuditLog` design:

- actor metadata: `actorType`, optional `actorUserId`, `actorLabel`, IP, user-agent.
- action metadata: `action`, `entityType`, `entityId`, severity.
- payload snapshots: `beforeJson`, `afterJson`, `metadataJson`.
- write-once semantics at app/service layer; no updates after insert.

Recommended policies:

- log all auth, role grants, listing status transitions, moderation decisions, and admin configuration changes.
- apply data retention policy (e.g., 18–36 months online, cold archive beyond that).

## 9) Seed Data Strategy

Production-safe seed phases:

1. **Static taxonomy seed**
   - roles, permissions, base country/provinces/districts/communes, amenity catalog.
2. **Bootstrap admins**
   - one super admin + one moderator + one content editor from secure env vars.
3. **Reference data seed**
   - default currency rate rows, starter CMS categories.

Guidelines:

- Never seed plaintext secrets.
- Hash passwords before insert.
- Make seeds idempotent using `upsert` and natural keys (`code`, `slug`, enum code).

## 10) Production PostgreSQL Notes for Ubuntu 24.04 VPS

Recommended PostgreSQL 16 baseline:

- `listen_addresses = '127.0.0.1'` (or Docker internal network only)
- `ssl = on` only if external DB connections are required
- `shared_buffers` ~ 20–25% RAM (single-node tuning)
- `work_mem` tuned conservatively for concurrent query load
- `wal_level = replica`, `max_wal_size` tuned for backup window
- timezone UTC at DB/session level

Security baseline:

- strong password auth (SCRAM-SHA-256)
- least-privilege DB user for app migrations/runtime
- no public Postgres port exposure

## 11) Migration Strategy

Use Prisma Migrate with strict promotion flow:

1. develop migration locally
2. review generated SQL
3. apply to staging snapshot
4. run integration and rollback simulation
5. apply to production during maintenance window

Rules:

- avoid destructive operations without backfill plan
- use expand/contract for high-risk changes:
  - add nullable column -> dual write -> backfill -> switch reads -> drop old column
- enforce migration lock + one pipeline owner per deploy

## 12) Backup Strategy Suitable for a VPS

Multi-layer backups:

- **Nightly logical backup**: `pg_dump -Fc`
- **Weekly full base backup**: `pg_basebackup` (or storage snapshot)
- **WAL archiving** for point-in-time recovery (PITR) once traffic grows
- **Off-server replication** of backups (object storage in separate region/provider)

Operational requirements:

- encrypt backups at rest and in transit
- retention policy (e.g., 7 daily, 4 weekly, 6 monthly)
- monthly restore drills to verify RPO/RTO targets
- monitor backup freshness and size anomalies

