"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 3001),
    DATABASE_URL: zod_1.z.string(),
    DIRECT_URL: zod_1.z.string().optional(),
    ACCESS_JWT_SECRET: zod_1.z.string().min(32, "Access JWT secret must be at least 32 characters long").default("your-access-secret-min-32-chars-long"),
    REFRESH_JWT_SECRET: zod_1.z.string().min(32, "Refresh JWT secret must be at least 32 characters long").default("your-refresh-secret-min-32-chars-long"),
    ACCESS_JWT_EXPIRES: zod_1.z.string().default("15m"),
    REFRESH_JWT_EXPIRES: zod_1.z.string().default("7d"),
    BCRYPT_ROUNDS: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 12),
    SUPABASE_URL: zod_1.z.string().url().optional(),
    SUPABASE_SERVICE_KEY: zod_1.z.string().optional(),
    SUPABASE_BUCKET: zod_1.z.string().default("media"),
    MAX_FILE_SIZE_MB: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    ALLOWED_MIME_TYPES: zod_1.z.string().default("image/jpeg,image/png,image/webp,image/gif,video/mp4"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
exports.default = {
    env: exports.env.NODE_ENV,
    port: exports.env.PORT,
    database_url: exports.env.DATABASE_URL,
    direct_url: exports.env.DIRECT_URL || exports.env.DATABASE_URL,
    jwt: {
        access_secret: exports.env.ACCESS_JWT_SECRET,
        refresh_secret: exports.env.REFRESH_JWT_SECRET,
        access_expires_in: exports.env.ACCESS_JWT_EXPIRES,
        refresh_expires_in: exports.env.REFRESH_JWT_EXPIRES,
        bcrypt_rounds: exports.env.BCRYPT_ROUNDS,
    },
    supabase: {
        url: exports.env.SUPABASE_URL || "https://placeholder.supabase.co",
        service_key: exports.env.SUPABASE_SERVICE_KEY || "placeholder-key",
        bucket: exports.env.SUPABASE_BUCKET,
    },
    file: {
        max_size_mb: exports.env.MAX_FILE_SIZE_MB,
        allowed_mime_types: exports.env.ALLOWED_MIME_TYPES.split(","),
    }
};
//# sourceMappingURL=index.js.map