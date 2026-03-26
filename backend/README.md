# RightBricks Backend Foundation

## Folder Structure

```text
backend/
  app/api/
    auth/register/route.ts
    auth/login/route.ts
    listings/route.ts
    listings/[id]/route.ts
    search/route.ts
    saved-searches/route.ts
    alerts/test/route.ts
    inquiries/route.ts
    viewing-requests/route.ts
    messages/thread/route.ts
    admin/moderation/listings/[id]/decision/route.ts
    cms/articles/route.ts
    seo/metadata/route.ts
    audit/route.ts
  app/search/page.tsx
  app/search/[scope]/[mode]/page.tsx
  app/sitemap.ts
  app/robots.ts
  app/listing/[slug]/page.tsx
  app/areas/[province]/page.tsx
  app/categories/[category]/page.tsx
  app/blog/[slug]/page.tsx
  app/guides/[slug]/page.tsx
  app/[slug]/page.tsx
  src/
    config/env.ts
    lib/
      prisma.ts
      logger.ts
      errors.ts
      http.ts
      auth.ts
      rbac.ts
      audit.ts
    services/
      auth.service.ts
      listing.service.ts
      search.service.ts
      saved-search.service.ts
      inquiry.service.ts
      viewing-request.service.ts
      moderation.service.ts
      cms.service.ts
      seo.service.ts
      notification.service.ts
    validation/
      auth.ts
      listings.ts
      inquiries.ts
      cms.ts
    search/
      types.ts
      filters.ts
      url.ts
      query-builder.ts
      ranking.ts
      use-search-state.ts
    components/search/
      filter-sidebar.tsx
      mobile-filter-drawer.tsx
      search-results-header.tsx
      active-filter-chips.tsx
      save-search-modal.tsx
      alert-creation-flow.tsx
      map-list-toggle.tsx
      result-list.tsx
      map-placeholder.tsx
    components/cms/
      homepage-sections.tsx
      bilingual-content.tsx
      json-ld.tsx
    seo/
      config.ts
      metadata.ts
      schema.ts
      sitemap.ts
      i18n.ts
  prisma/seed.ts
  infra/docker/
    Dockerfile
    docker-compose.yml
  infra/systemd/rightbricks-backend.service
  docs/deployment-ubuntu-24.04.md
  .env.example
  .env.production.example
  package.json
  tsconfig.json
  next.config.ts
```

## Production startup (Ubuntu 24.04)

```bash
cd /opt/rightbricks/backend/backend
docker compose -f infra/docker/docker-compose.yml up -d --build
```

## Production restart

```bash
sudo systemctl restart rightbricks-backend.service
```

## Migrations and seed

```bash
docker compose -f infra/docker/docker-compose.yml exec app npx prisma migrate deploy
docker compose -f infra/docker/docker-compose.yml exec app npm run seed
```

## Dashboard routes

- `/dashboard/owner`
- `/dashboard/agent`
- `/dashboard/agency-admin`
- `/dashboard/developer`
- `/dashboard/moderator`
- `/dashboard/content-editor`
- `/dashboard/super-admin`
