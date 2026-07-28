export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    ACCESS_JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    ACCESS_JWT_EXPIRES: string;
    REFRESH_JWT_EXPIRES: string;
    BCRYPT_ROUNDS: number;
    SUPABASE_BUCKET: string;
    MAX_FILE_SIZE_MB: number;
    ALLOWED_MIME_TYPES: string;
    DIRECT_URL?: string | undefined;
    SUPABASE_URL?: string | undefined;
    SUPABASE_SERVICE_KEY?: string | undefined;
};
declare const _default: {
    env: "development" | "production" | "test";
    port: number;
    database_url: string;
    direct_url: string;
    jwt: {
        access_secret: string;
        refresh_secret: string;
        access_expires_in: string;
        refresh_expires_in: string;
        bcrypt_rounds: number;
    };
    supabase: {
        url: string;
        service_key: string;
        bucket: string;
    };
    file: {
        max_size_mb: number;
        allowed_mime_types: string[];
    };
};
export default _default;
