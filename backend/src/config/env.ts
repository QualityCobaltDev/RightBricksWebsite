import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().default("RightBricks"),
  APP_URL: z.string().url(),
  CANONICAL_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(2592000),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().email(),
  SEARCH_PROVIDER: z.enum(["opensearch", "postgres"]).default("opensearch"),
  SEARCH_URL: z.string().url(),
  SEARCH_INDEX_LISTINGS: z.string().default("rightbricks_listings_v1"),
  MAP_STYLE_URL: z.string().url(),
  MAP_DEFAULT_LAT: z.coerce.number(),
  MAP_DEFAULT_LNG: z.coerce.number(),
  MAP_DEFAULT_ZOOM: z.coerce.number().default(12),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

export const env = EnvSchema.parse(process.env);
