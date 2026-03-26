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
