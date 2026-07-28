export declare const permissionService: {
    createPermission: (data: {
        name: string;
        description?: string;
    }) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    getAllPermissions: (options: {
        page?: number | string;
        limit?: number | string;
        sortBy?: string;
        sortOrder?: string;
        search?: string;
    }) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        }[];
    }>;
    getSinglePermission: (id: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    updatePermission: (id: string, data: {
        name?: string;
        description?: string;
    }) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    deletePermission: (id: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
};
