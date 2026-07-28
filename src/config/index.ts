import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().optional().transform((val) => val ? parseInt(val, 10) : 3001),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  ACCESS_JWT_SECRET: z.string().min(32, "Access JWT secret must be at least 32 characters long").default("your-access-secret-min-32-chars-long"),
  REFRESH_JWT_SECRET: z.string().min(32, "Refresh JWT secret must be at least 32 characters long").default("your-refresh-secret-min-32-chars-long"),
  ACCESS_JWT_EXPIRES: z.string().default("15m"),
  REFRESH_JWT_EXPIRES: z.string().default("7d"),
  BCRYPT_ROUNDS: z.string().optional().transform((val) => val ? parseInt(val, 10) : 12),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default("media"),
  MAX_FILE_SIZE_MB: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  ALLOWED_MIME_TYPES: z.string().default("image/jpeg,image/png,image/webp,image/gif,video/mp4"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  database_url: env.DATABASE_URL,
  direct_url: env.DIRECT_URL || env.DATABASE_URL,
  jwt: {
    access_secret: env.ACCESS_JWT_SECRET,
    refresh_secret: env.REFRESH_JWT_SECRET,
    access_expires_in: env.ACCESS_JWT_EXPIRES,
    refresh_expires_in: env.REFRESH_JWT_EXPIRES,
    bcrypt_rounds: env.BCRYPT_ROUNDS,
  },
  supabase: {
    url: env.SUPABASE_URL || "https://placeholder.supabase.co",
    service_key: env.SUPABASE_SERVICE_KEY || "placeholder-key",
    bucket: env.SUPABASE_BUCKET,
  },
  file: {
    max_size_mb: env.MAX_FILE_SIZE_MB,
    allowed_mime_types: env.ALLOWED_MIME_TYPES.split(","),
  }
};
