# Trends Bird Limited — Backend Developer Intern Assessment

Express + TypeScript + Prisma + PostgreSQL (Supabase) modular backend.

- **Developer:** Md Asif Al Azad
- **Deadline:** 1 August 2026, 11:59 PM
- **Deploy Environment:** Vercel Serverless Function
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (Free tier bucket)

---

## Technical Features Implemented

1. **Access Control & Permissions**:
   - Middleware-driven authorization via `Bearer <JWT_Access_Token>` in header.
   - Robust wildcard permissions (e.g., `product:*` grants access to `product:create`, `product:read`, etc.).
   - Cascade and restrict guards applied to database level via Prisma schema.
2. **JWT Security & Token Rotation**:
   - Access token expires in **15 minutes**.
   - Refresh token expires in **7 days**, stored as a bcrypt hash in the database.
   - Token rotation on every refresh request, and database revocation on logout (set to `null`).
   - Secure authentication response: same `"Invalid credentials"` message returned on wrong email/password.
3. **Optimized File Uploads (Vercel Ready)**:
   - Multer initialized with `memoryStorage` (zero disk write dependency for Serverless).
   - Sharp handles image resizing (max 1200px dimension) and 200x200px thumbnail rendering before upload.
   - Saves optimized files directly to Supabase Storage and records public URL path in the DB.
4. **Safety Guards**:
   - **No Public Signup**: Users can only be created by an authenticated user with `user:create` permission.
   - **Self-Escalation Check**: Users cannot change their own roles.
   - **Circular Categories check**: Category updates check parents recursively to prevent tree cycle dependencies.
   - **Reference check guards**: Prevents deleting brands, roles, and media attachments if they are associated with existing records.
5. **Transactional Product Creation**:
   - DB transaction ensures creation of simple or variable products rolls back entirely if any variant combination duplicate, SKU constraint, or category link fails.

---

## Local Setup & Installation

### 1. Configure Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
ACCESS_JWT_SECRET=your-access-secret-at-least-32-chars-long
REFRESH_JWT_SECRET=your-refresh-secret-at-least-32-chars-long
ACCESS_JWT_EXPIRES=15m
REFRESH_JWT_EXPIRES=7d
BCRYPT_ROUNDS=12
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
SUPABASE_BUCKET=media
MAX_FILE_SIZE_MB=10
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif,video/mp4
PORT=3001
NODE_ENV=development
```

### 2. Install Dependencies
Run the following command to download NPM packages:
```bash
npm install
```

### 3. Setup Database Schema & Seed
Sync your Supabase PostgreSQL database schema and run the seed script to create initial credentials:
```bash
# Push database schema
npx prisma db push

# Generate client
npm run prisma:generate

# Populate database
npm run prisma:seed
```

### 4. Start Server
Run the local dev server (using ts-node-dev):
```bash
npm run dev
```
The server will boot on `http://localhost:3001` (or your configured port).

---

## Seed Accounts Credentials

- **Super Admin**:
  - **Email:** `superadmin@trendsbird.com`
  - **Password:** `SuperAdmin@123`
- **Catalog Manager**:
  - **Email:** `catalog@trendsbird.com`
  - **Password:** `Catalog@123`

*(Note: Catalog Manager lacks `user:*`, `role:*`, and `permission:*` permissions, allowing you to test 403 Forbidden status codes).*

---

## API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` - Login with credentials (returns access and refresh tokens).
- `POST /api/auth/refresh` - Rotate tokens (requires `refreshToken` in body).
- `POST /api/auth/logout` - Revokes refresh token (requires Bearer token header).
- `GET /api/auth/session` - Returns logged in user profile (requires Bearer token header).

### 👥 Users (`/api/users`)
- `POST /api/users` - Create user (Protected, `user:create`).
- `GET /api/users` - Get all users (Protected, `user:read`).
- `GET /api/users/:id` - Get user by ID (Protected, `user:read`).
- `PATCH /api/users/:id` - Update user (Protected, `user:update` + Self-Escalation guard).
- `DELETE /api/users/:id` - Delete user (Protected, `user:delete`).

### 🛡️ Roles & Permissions (`/api/roles` & `/api/permissions`)
- `POST /api/roles` - Create role (Protected, `role:create`).
- `POST /api/roles/:id/permissions` - Assign permission to role (Protected, `role:update`).
- `DELETE /api/roles/:id/permissions/:pid` - Remove permission from role (Protected, `role:update` + Last `role:update` check).
- `DELETE /api/roles/:id` - Delete role (Protected, `role:delete` + check if active users hold it).

### 📁 Media (`/api/media`)
- `POST /api/media/upload` - Upload file (Protected, `media:create`, accepts `file` field in multipart form).
- `GET /api/media` - Get all media (Protected, `media:read`).
- `DELETE /api/media/:id` - Delete media (Protected, `media:delete` + check if attached to products).

### 📁 Catalog Categories (`/api/categories`)
- `POST /api/categories` - Create Category (Protected, `category:create`).
- `GET /api/categories` - Get Categories (add query parameter `?tree=true` for JSON tree structure).
- `PATCH /api/categories/:id` - Update Category (Protected, `category:update` + circular cycle check).
- `DELETE /api/categories/:id` - Delete Category (Protected, `category:delete` + checks if referenced).

### 🏷️ Brands (`/api/brands`)
- `POST /api/brands` - Create Brand (Protected, `brand:create`).
- `DELETE /api/brands/:id` - Delete Brand (Protected, `brand:delete` + check if product references exist).

### ⚙️ Attributes (`/api/attributes`)
- `POST /api/attributes` - Create Attribute.
- `POST /api/attributes/:id/values` - Create Attribute value (e.g., Red).
- `DELETE /api/attributes/:id/values/:vid` - Delete Attribute value.

### 📦 Products (`/api/products`)
- `POST /api/products` - Create simple/variable product (Protected, `product:create`).
- `GET /api/products` - Query products with search, pagination, category & brand filtering.
- `DELETE /api/products/:id` - Delete product.
