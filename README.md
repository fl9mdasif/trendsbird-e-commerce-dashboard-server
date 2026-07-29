# 🚀 Trends Bird E-Commerce Dashboard — Backend Server API

An enterprise-grade, highly secure RESTful API backend engineered for an E-Commerce Management Dashboard. Built with **Node.js, Express, TypeScript, Prisma 7, PostgreSQL (Supabase), Zod, and Supabase Cloud Storage**.

---

## 🛠️ Tech Stack & Key Technologies

- **Core Runtime:** Node.js (v18+)
- **Language:** TypeScript (Strict Mode)
- **Web Framework:** Express.js (v5)
- **Database & ORM:** PostgreSQL (Supabase) with Prisma ORM 7 (`@prisma/adapter-pg` driver adapters)
- **Cloud Storage:** Supabase Storage Bucket Integration
- **Media Optimization:** Sharp (WebP conversion, thumbnail generation, resolution scaling)
- **Validation Engine:** Zod (Type-safe schema validation)
- **Security & Authentication:** JSON Web Tokens (JWT), Bcrypt (12 Salt Rounds), Role-Based Access Control (RBAC)
- **Deployment Platform:** Vercel Serverless Functions (`@vercel/node`)

---

## ⚡ Architectural Highlights & Business Rules

### 1. Dual-Token Authentication & Refresh Rotation
- **Access Tokens:** Short-lived JWTs (stateless verification for maximum server speed).
- **Refresh Tokens:** Long-lived tokens stored as **Bcrypt hashes** in PostgreSQL. Automatically rotated upon each refresh to prevent token reuse and replay attacks.
- **Anti-Enumeration Guard:** Login credential errors return uniform `"Invalid credentials"` messages to prevent user email probing.

### 2. Fine-Grained Role-Based Access Control (RBAC)
- Supports granular action permissions (`product:create`, `user:delete`), module wildcards (`product:*`), and global superadmin wildcards (`*`).
- **Role Lockout Guard:** Prevents removing the `role:update` permission from the final remaining admin role to prevent administrative lockout.
- **Role Deletion Guard:** Refuses role deletion if active users are assigned to it.

### 3. Product Catalog Architecture (ACID Transactions)
- **Simple vs. Variable Products:** Simple products maintain top-level pricing/stock; Variable products maintain `null` top-level pricing and delegate pricing/SKU/attributes to individual variants.
- **Prisma Transactions:** Product creation spans 5 tables (`Product`, `ProductCategory`, `MediaAttachment`, `Variant`, `VariantAttribute`) wrapped inside `prisma.$transaction` for 100% ACID compliance.
- **Duplicate Variant Combination Check:** Real-time hash checking prevents duplicate variant attribute combinations.

### 4. Category Tree Structure & Cycle Detection
- Supports flat data fetching or nested tree JSON output (`GET /api/v1/categories?tree=true`) constructed in $O(N)$ time.
- **Cycle Detection Algorithm:** Prevents circular parent-child dependency loops during category hierarchy updates.

### 5. Media Processing & Serverless Compatibility
- Uses Multer `memoryStorage` for compatibility with Vercel serverless functions.
- Automatically converts uploaded images into lightweight `.webp` formats (80% compression) and generates 200x200px cover thumbnails using Sharp.
- **Attachment Guard:** Protects media files from deletion if currently referenced by catalog products.

---

## 📦 Project Directory Structure

```text
server/
├── api/
│   └── index.ts                 # Serverless Entry Point for Vercel
├── prisma/
│   ├── schema.prisma            # PostgreSQL Database Schema
│   └── seed.ts                  # Super Admin & Catalog Manager Seed Script
├── src/
│   ├── app/
│   │   ├── errors/              # Custom ApiError Classes
│   │   ├── interfaces/          # TypeScript Types & Request Interfaces
│   │   ├── middlewares/         # Auth, RequirePermission, Zod Validation, Global Error
│   │   ├── modules/
│   │   │   ├── attribute/       # Attribute & Value Management
│   │   │   ├── auth/            # JWT Login, Session, Refresh Rotation, Logout
│   │   │   ├── brand/           # Brand Management
│   │   │   ├── category/        # Category Tree & Cycle Detection
│   │   │   ├── media/           # Sharp Image Processing & Supabase Upload
│   │   │   ├── permission/      # Permission Groups CRUD
│   │   │   ├── product/         # Transactional Simple & Variable Products
│   │   │   ├── role/            # Role CRUD & Permission Mapping
│   │   │   └── user/            # User Management & Self-Escalation Guard
│   │   └── routes/              # Centralized Module Router
│   ├── config/                  # Envt Variables Loading & Supabase Client
│   ├── helpers/                 # Pagination & JWT Helper Functions
│   ├── shared/                  # Response Formatter & Prisma Instance
│   ├── app.ts                   # Express Application Setup
│   └── server.ts                # Local Server Startup Entrypoint
├── .env.example                 # Environment Variable Template
├── prisma.config.ts             # Prisma 7 Datasource Configuration
├── tsconfig.json                # TypeScript Config
└── vercel.json                  # Vercel Deployment Routing Config
```

---

## 🚀 Getting Started & Local Development Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL Database (Supabase PostgreSQL instance recommended)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd server
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```
Fill in your database connection string and Supabase Storage credentials in `.env`.

### 5. Generate Prisma Client & Run Database Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Seed the Database
Populates initial permissions, Super Admin (`superadmin@trendsbird.com`), and Catalog Manager roles/users:
```bash
npm run prisma:seed
```

### 7. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3001` (or your configured `PORT`).

---

## 📑 API Endpoints Summary

Base Route Prefix: `/api` or `/api/v1`

| Module | Method | Endpoint | Required Permission | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Public | Login credentials check & Access/Refresh token issuance |
| **Auth** | `GET` | `/auth/session` | Authenticated | Retrieve current user session profile |
| **Auth** | `POST` | `/auth/refresh` | Public | Rotate refresh token & issue new access token |
| **Auth** | `POST` | `/auth/logout` | Authenticated | Revoke refresh token hash in database |
| **Permissions** | `POST` | `/permissions` | `permission:create` | Create a new permission entry |
| **Permissions** | `GET` | `/permissions` | `permission:read` | List permissions with search & pagination |
| **Roles** | `POST` | `/roles` | `role:create` | Create a new role |
| **Roles** | `POST` | `/roles/:id/permissions` | `role:update` | Assign permission to role |
| **Roles** | `DELETE` | `/roles/:id/permissions/:pid` | `role:update` | Remove permission from role (Lockout guarded) |
| **Users** | `POST` | `/users` | `user:create` | Provision new internal user (No public signup) |
| **Users** | `PATCH` | `/users/:id` | `user:update` | Update user details (Self-escalation guarded) |
| **Media** | `POST` | `/media/upload` | `media:create` | Upload single file (Sharp WebP + Supabase Cloud) |
| **Media** | `POST` | `/media/upload-bulk` | `media:create` | Upload multiple files in a single request |
| **Categories** | `POST` | `/categories` | `category:create` | Create parent/child category |
| **Categories** | `GET` | `/categories?tree=true` | `category:read` | List category tree structure |
| **Brands** | `POST` | `/brands` | `brand:create` | Create brand entry |
| **Attributes** | `POST` | `/attributes` | `attribute:create` | Create parent attribute (e.g. Color) |
| **Attributes** | `POST` | `/attributes/:id/values` | `attribute:create` | Create nested attribute value (e.g. Red) |
| **Products** | `POST` | `/products` | `product:create` | Create Simple/Variable product inside DB transaction |
| **Products** | `GET` | `/products` | `product:read` | List products with filters, search, and relations |

---

## 🌐 Deployment Instructions (Vercel Serverless)

1. Import this repository into your **Vercel Dashboard**.
2. Set the root directory to `server/` (if part of a monorepo) or root.
3. Configure your Environment Variables in **Vercel Project Settings -> Environment Variables** (matching `.env.example`).
4. Click **Deploy**. Vercel will automatically build and route incoming requests via `api/index.ts` and `vercel.json`.

---

## 📜 License
This project is proprietary software for Trends Bird E-Commerce Dashboard.
