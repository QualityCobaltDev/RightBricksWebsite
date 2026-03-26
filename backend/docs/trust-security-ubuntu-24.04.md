# Trust, Verification, and Moderation Security Notes (Ubuntu 24.04 VPS)

## Core principles

- Verification documents are **private-only** objects; never exposed through public bucket URLs.
- All upload URLs must be short-lived signed URLs (recommended <= 10 minutes).
- Access to verification files is restricted to moderation/admin services and never rendered on public pages.
- No VNC or control-panel metadata is exposed in code paths, templates, logs, or public responses.

## Storage model

- Public listing media bucket: `rightbricks-prod-media`
- Private verification bucket: `rightbricks-private-kyc`
- Private keys scoped by tenant path: `verification/{actorId}/{timestamp}-{uuid}-{filename}`

## Nginx and VPS controls

- Keep app behind Nginx only (`127.0.0.1:3000`).
- Block direct object-storage credentials from logs using redaction.
- Restrict access to admin/moderation endpoints via auth + RBAC and optional IP allowlisting.

## Ubuntu 24.04 host hardening

- UFW allow only SSH, 80, 443.
- Enable unattended-upgrades for security patches.
- Rotate secrets periodically (`JWT_SECRET`, S3 keys, SMTP creds).
- Use encrypted offsite backups for DB and private bucket snapshots.

## Runtime checks

- Verify private bucket ACL policy denies anonymous `GetObject`.
- Verify `/api/verification/upload-url` returns `x-amz-acl: private`.
- Verify moderation APIs require privileged roles.

## Incident handling

- Every moderation decision and note must emit audit events.
- Abuse reports escalate into moderation cases with decision trace and timestamp.
- Rejected or suspended cases should include reason templates and internal notes.
