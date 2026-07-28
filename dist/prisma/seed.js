"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
async function main() {
    console.log("🌱 Starting database seeding...");
    // 1. Create Permissions
    const permissionsList = [
        // Wildcards
        { name: "*", description: "All permissions wildcard" },
        { name: "user:*", description: "Manage all users" },
        { name: "role:*", description: "Manage all roles" },
        { name: "permission:*", description: "Manage all permissions" },
        { name: "category:*", description: "Manage all categories" },
        { name: "brand:*", description: "Manage all brands" },
        { name: "attribute:*", description: "Manage all attributes" },
        { name: "product:*", description: "Manage all products" },
        { name: "media:*", description: "Manage all media" },
        // Users
        { name: "user:create", description: "Create user" },
        { name: "user:read", description: "Read users" },
        { name: "user:update", description: "Update user" },
        { name: "user:delete", description: "Delete user" },
        // Roles
        { name: "role:create", description: "Create role" },
        { name: "role:read", description: "Read roles" },
        { name: "role:update", description: "Update role" },
        { name: "role:delete", description: "Delete role" },
        // Permissions
        { name: "permission:create", description: "Create permission" },
        { name: "permission:read", description: "Read permissions" },
        { name: "permission:update", description: "Update permission" },
        { name: "permission:delete", description: "Delete permission" },
        // Categories
        { name: "category:create", description: "Create category" },
        { name: "category:read", description: "Read categories" },
        { name: "category:update", description: "Update category" },
        { name: "category:delete", description: "Delete category" },
        // Brands
        { name: "brand:create", description: "Create brand" },
        { name: "brand:read", description: "Read brands" },
        { name: "brand:update", description: "Update brand" },
        { name: "brand:delete", description: "Delete brand" },
        // Attributes
        { name: "attribute:create", description: "Create attribute" },
        { name: "attribute:read", description: "Read attributes" },
        { name: "attribute:update", description: "Update attribute" },
        { name: "attribute:delete", description: "Delete attribute" },
        // Products
        { name: "product:create", description: "Create product" },
        { name: "product:read", description: "Read products" },
        { name: "product:update", description: "Update product" },
        { name: "product:delete", description: "Delete product" },
        // Media
        { name: "media:create", description: "Upload media" },
        { name: "media:read", description: "Read media" },
        { name: "media:delete", description: "Delete media" },
    ];
    const dbPermissions = {};
    for (const perm of permissionsList) {
        const dbPerm = await prisma_1.default.permission.upsert({
            where: { name: perm.name },
            update: { description: perm.description },
            create: perm,
        });
        dbPermissions[perm.name] = dbPerm;
    }
    console.log(`✅ Created/upserted ${permissionsList.length} permissions.`);
    // 2. Create Roles
    // Super Admin
    const superAdminRole = await prisma_1.default.role.upsert({
        where: { name: "Super Admin" },
        update: {},
        create: {
            name: "Super Admin",
            description: "Super Administrator with full access",
        },
    });
    // Catalog Manager
    const catalogManagerRole = await prisma_1.default.role.upsert({
        where: { name: "Catalog Manager" },
        update: {},
        create: {
            name: "Catalog Manager",
            description: "Manager for managing Catalog data (products, brands, attributes, etc.)",
        },
    });
    console.log("✅ Created roles: 'Super Admin', 'Catalog Manager'.");
    // 3. Assign Role Permissions
    // Super Admin gets "*" wildcard
    await prisma_1.default.rolePermission.upsert({
        where: {
            roleId_permissionId: {
                roleId: superAdminRole.id,
                permissionId: dbPermissions["*"].id,
            },
        },
        update: {},
        create: {
            roleId: superAdminRole.id,
            permissionId: dbPermissions["*"].id,
        },
    });
    // Catalog Manager gets: category:*, brand:*, attribute:*, product:*, media:*
    const managerPermNames = ["category:*", "brand:*", "attribute:*", "product:*", "media:*"];
    for (const name of managerPermNames) {
        await prisma_1.default.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: catalogManagerRole.id,
                    permissionId: dbPermissions[name].id,
                },
            },
            update: {},
            create: {
                roleId: catalogManagerRole.id,
                permissionId: dbPermissions[name].id,
            },
        });
    }
    console.log("✅ Assigned role permissions.");
    // 4. Create Users
    // Super Admin: superadmin@trendsbird.com / SuperAdmin@123
    const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 12);
    await prisma_1.default.user.upsert({
        where: { email: "superadmin@trendsbird.com" },
        update: {
            password: superAdminPassword,
            roleId: superAdminRole.id,
            active: true,
        },
        create: {
            name: "Super Admin",
            email: "superadmin@trendsbird.com",
            password: superAdminPassword,
            roleId: superAdminRole.id,
            active: true,
        },
    });
    // Catalog Manager: catalog@trendsbird.com / Catalog@123
    const catalogManagerPassword = await bcrypt.hash("Catalog@123", 12);
    await prisma_1.default.user.upsert({
        where: { email: "catalog@trendsbird.com" },
        update: {
            password: catalogManagerPassword,
            roleId: catalogManagerRole.id,
            active: true,
        },
        create: {
            name: "Catalog Manager",
            email: "catalog@trendsbird.com",
            password: catalogManagerPassword,
            roleId: catalogManagerRole.id,
            active: true,
        },
    });
    console.log("✅ Created/upserted seed users.");
    console.log("🌱 Database seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map