import { z } from "zod";
export declare const authValidation: {
    loginSchema: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    refreshSchema: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
