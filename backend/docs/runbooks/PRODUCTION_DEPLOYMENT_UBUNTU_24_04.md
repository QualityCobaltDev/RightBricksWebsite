# RightBricks Production Deployment Package (Ubuntu 24.04)

## 1) Nginx site config (`rightbricks.online` + `www` redirect)

Use file: `infra/nginx/rightbricks.online.conf`.

Install:

```bash
sudo cp /opt/rightbricks/current/backend/infra/nginx/rightbricks.online.conf /etc/nginx/sites-available/rightbricks.online
sudo ln -s /etc/nginx/sites-available/rightbricks.online /etc/nginx/sites-enabled/rightbricks.online
sudo nginx -t
sudo systemctl reload nginx
```

## 2) Let's Encrypt setup commands

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rightbricks.online -d www.rightbricks.online --agree-tos -m admin@rightbricks.online --redirect -n
sudo systemctl status certbot.timer
```

## 3) UFW firewall commands

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose
```

## 4) PostgreSQL install + secure setup

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql <<'SQL'
CREATE ROLE rightbricks_app LOGIN PASSWORD 'REPLACE_DB_PASSWORD';
CREATE DATABASE rightbricks_prod OWNER rightbricks_app;
REVOKE ALL ON DATABASE rightbricks_prod FROM PUBLIC;
GRANT CONNECT, TEMP ON DATABASE rightbricks_prod TO rightbricks_app;
SQL
```

`/etc/postgresql/16/main/postgresql.conf`:

```conf
listen_addresses = '127.0.0.1'
password_encryption = scram-sha-256
```

`/etc/postgresql/16/main/pg_hba.conf` (keep local-only auth):

```conf
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

```bash
sudo systemctl restart postgresql
```

## 5) Node.js install steps (Ubuntu 24.04)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 6) App deployment directory structure

```text
/opt/rightbricks/
  repo/                      # bare/working git mirror
  releases/<git-sha>/        # immutable release directories
  current -> releases/<sha>/ # symlink to active release
  shared/
    .env.production
  backups/
    db/
    uploads/
```

## 7) Environment template

Use `backend/.env.production.example` as baseline and store live secrets in:

`/opt/rightbricks/shared/.env.production`

Mandatory values include:

- `APP_URL=https://rightbricks.online`
- `CANONICAL_BASE_URL=https://rightbricks.online`
- DB credentials
- JWT secret
- SMTP credentials
- S3 public/private endpoints and buckets

## 8) systemd service config

Use file: `backend/infra/systemd/rightbricks-backend.service`

Install:

```bash
sudo cp /opt/rightbricks/current/backend/infra/systemd/rightbricks-backend.service /etc/systemd/system/rightbricks-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now rightbricks-backend.service
```

## 9) Log rotation strategy

Use file: `backend/infra/logrotate/rightbricks-backend`

Install:

```bash
sudo cp /opt/rightbricks/current/backend/infra/logrotate/rightbricks-backend /etc/logrotate.d/rightbricks-backend
sudo logrotate -f /etc/logrotate.d/rightbricks-backend
```

## 10) Backup commands (database + uploads)

```bash
/opt/rightbricks/current/backend/infra/scripts/backup.sh
```

Recommended schedule (daily 02:15 UTC):

```bash
( crontab -l 2>/dev/null; echo "15 2 * * * /opt/rightbricks/current/backend/infra/scripts/backup.sh >> /var/log/rightbricks-backup.log 2>&1" ) | crontab -
```

## 11) Restore commands

```bash
/opt/rightbricks/current/backend/infra/scripts/restore.sh /opt/rightbricks/backups/db/rightbricks_YYYYMMDDTHHMMSSZ.dump
```

## 12) Release/update procedure

```bash
/opt/rightbricks/current/backend/infra/scripts/deploy.sh <git-sha-or-tag>
sudo systemctl reload rightbricks-backend.service
```

Post-release verification:

```bash
curl -I https://rightbricks.online
curl -I https://rightbricks.online/robots.txt
curl -I https://rightbricks.online/sitemap.xml
```

## 13) Rollback procedure

```bash
/opt/rightbricks/current/backend/infra/scripts/rollback.sh <previous-release-sha>
sudo systemctl reload rightbricks-backend.service
```

## 14) DNS setup instructions

- `A` record: `rightbricks.online` -> `207.180.207.22`
- `A` record: `www.rightbricks.online` -> `207.180.207.22`
- `AAAA` record: `rightbricks.online` -> `2a02:c207:2313:3086::1`
- `AAAA` record: `www.rightbricks.online` -> `2a02:c207:2313:3086::1`

## 15) Final production verification checklist

- [ ] SSL valid on `https://rightbricks.online`
- [ ] `www.rightbricks.online` redirects to apex
- [ ] UFW allows only SSH/80/443
- [ ] Postgres not publicly exposed
- [ ] `/robots.txt` and `/sitemap.xml` return 200 over HTTPS
- [ ] `.env.production` contains no placeholder secrets
- [ ] Private verification bucket blocks anonymous access
- [ ] Backup + restore dry-run completed
- [ ] Moderation and verification flows tested by role
- [ ] Audit events visible for trust actions
