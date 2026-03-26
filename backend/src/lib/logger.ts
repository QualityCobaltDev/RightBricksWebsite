import pino from "pino";
import { env } from "@/config/env";

export const logger = pino({
  name: env.APP_NAME,
  level: env.LOG_LEVEL,
  redact: {
    paths: ["req.headers.authorization", "password", "token", "secret", "smtpPass"],
    censor: "[REDACTED]",
  },
});
