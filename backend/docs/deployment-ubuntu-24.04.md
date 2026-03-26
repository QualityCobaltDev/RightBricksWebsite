# RightBricks Backend Deployment (Ubuntu 24.04 VPS)

## 1. DNS

- `A` record: `rightbricks.online` -> `207.180.207.22`
- `AAAA` record (optional): `rightbricks.online` -> `2a02:c207:2313:3086::1`

## 2. Install runtime dependencies

```bash
sudo apt update && sudo apt install -y nginx docker.io docker-compose-v2 certbot python3-certbot-nginx ufw
sudo systemctl enable --now docker nginx
```

## 3. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 4. Backend setup

```bash
sudo mkdir -p /opt/rightbricks
sudo chown -R $USER:$USER /opt/rightbricks
cd /opt/rightbricks
git clone <your-repo-url> backend
cd backend/backend
cp .env.production.example .env.production
# edit .env.production with production secrets
```

## 5. Build and start stack

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

## 6. Run migrations and seed

```bash
docker compose -f infra/docker/docker-compose.yml exec app npx prisma migrate deploy
docker compose -f infra/docker/docker-compose.yml exec app npm run seed
```

## 7. Nginx reverse proxy for rightbricks.online

Create `/etc/nginx/sites-available/rightbricks.online`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name rightbricks.online;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/rightbricks.online /etc/nginx/sites-enabled/rightbricks.online
sudo nginx -t
sudo systemctl reload nginx
```

## 8. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d rightbricks.online --redirect -m admin@rightbricks.online --agree-tos -n
```

## 9. Service startup on reboot (systemd)

```bash
sudo cp infra/systemd/rightbricks-backend.service /etc/systemd/system/rightbricks-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now rightbricks-backend.service
```

## 10. Restart and logs

```bash
sudo systemctl restart rightbricks-backend.service
docker compose -f /opt/rightbricks/backend/backend/infra/docker/docker-compose.yml logs -f app
sudo tail -f /var/log/nginx/error.log
```

## 11. Nginx-friendly sitemap and robots notes

- Ensure `https://rightbricks.online/sitemap.xml` and `https://rightbricks.online/robots.txt` are proxied directly to Next.js.
- Do not rewrite these endpoints to static files unless you introduce a static sitemap build step.
- Recommended cache policy:
  - `robots.txt`: short cache (5–15 minutes)
  - `sitemap.xml`: moderate cache (30–60 minutes)
- Keep gzip enabled for `application/xml` responses.
- Validate post-deploy:
  - `curl -I https://rightbricks.online/robots.txt`
  - `curl -I https://rightbricks.online/sitemap.xml`
