export declare const authService: {
    loginUser: (payload: any) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    refreshTokens: (refreshToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutUser: (userId: string) => Promise<void>;
};
