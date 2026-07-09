# Mayuresh Enterprises — PrintPerfect Setup Guide

This document explains the complete backend and deployment setup for the **PrintPerfect E-commerce App**.

---

## 1. Project Overview

- **App name:** PrintPerfect E-commerce App
- **Brand:** Mayuresh Enterprises
- **Type:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **Project ID / Ref:** `npfjacpfyrmopnoaktzc`

---

## 2. Environment Variables

Copy `.env` and keep these variables updated:

```bash
VITE_SUPABASE_URL=https://npfjacpfyrmopnoaktzc.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_APP_ID=app-cdkoojeqtu69
```

> **Never commit secrets.** `.env` is already in `.gitignore`.

### Where to get the keys

1. Open the [Supabase Dashboard](https://app.supabase.com/).
2. Select the project `Mayuresh Enterprises`.
3. Go to **Project Settings > API**.
4. Copy **Project URL** and **anon public key** into `.env`.

---

## 3. Database Schema

The Supabase Postgres database currently has the following tables in the `public` schema.

### 3.1 Public Tables

| Table | Purpose |
|-------|---------|
| `about_us` | Hero section, story, and CTA content for the About page. |
| `banners` | Homepage carousel / banner slides. |
| `categories` | Product categories (name, slug, image, sort order). |
| `subcategories` | Subcategories linked to categories. |
| `products` | Product catalog with pricing, stock, images, tags, and ratings. |
| `services` | Printing services listing and detail content. |
| `service_gallery` | Gallery images for each service. |
| `company_gallery` | Company photos for the About page gallery. |
| `company_journey` | Timeline / milestone entries for the About page. |
| `company_statistics` | Stat counters displayed on the About page. |
| `why_choose_us` | Feature cards / reasons to choose the company. |
| `coupons` | Discount coupons (percentage / fixed). |
| `orders` | Customer order records. |
| `order_items` | Line items for each order. |
| `reviews` | Product reviews and ratings. |
| `enquiries` | Customer enquiries / quote requests. |
| `notifications` | In-app and push notification messages. |
| `user_profiles` | Extended user profile fields (name, phone, avatar, role). |
| `user_push_tokens` | OneSignal push token storage per user. |
| `wishlists` | User wishlist / favorite products. |

### 3.2 Key Columns Summary

- All tables use `uuid` primary keys (`gen_random_uuid()` or `uuid_generate_v4()`).
- Common audit columns: `created_at` and `updated_at` default to `now()`.
- `user_profiles.id` maps to `auth.users.id`.
- `orders.order_number` is generated uniquely.
- `products.images` and `products.tags` are `text[]` arrays.
- `services.features` and `services.benefits` are `text[]` arrays.
- `orders.shipping_address` is stored as `jsonb`.

---

## 4. Row Level Security (RLS)

RLS is enabled on all tables. The main permission pattern is:

- **`anon`** users can read public content (active categories, products, services, banners, etc.).
- **`authenticated`** users can read public content and manage their own data (profile, orders, wishlist, enquiries, push tokens).
- **Admins** have full access to all tables. Admin detection uses a helper function (commonly `is_admin()`) that checks `user_profiles.role = 'admin'`.

### Important RLS Notes

- `enquiries`: anyone can create; users see only their own; admins see all.
- `orders` / `order_items`: users see/insert only their own; admins have full control.
- `wishlists`: anonymous users are denied all operations.
- `user_push_tokens`: users manage their own tokens; admins can read all tokens.
- `notifications`: users read their own + global notifications; admins can manage all.

---

## 5. Storage Buckets

| Bucket | Public | MIME Types | Size Limit | Purpose |
|--------|--------|------------|------------|---------|
| `avatars` | Yes | `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/avif` | 1 MB | User profile photos. |
| `images` | Yes | Any | Default | General content images (products, services, banners, etc.). |

Images are never stored as Base64 in the database; only Supabase Storage URLs are saved.

---

## 6. Edge Functions

### 6.1 Available Function

| Function | Path | Purpose |
|----------|------|---------|
| `send-push-notification` | `supabase/functions/send-push-notification/` | Sends push notifications via OneSignal using stored player IDs. |

### 6.2 How to Deploy an Edge Function

1. Make sure the Supabase CLI is installed:

   ```bash
   npm i -g supabase
   ```

2. Link the local project (run once):

   ```bash
   supabase link --project-ref npfjacpfyrmopnoaktzc
   ```

3. Deploy the function:

   ```bash
   supabase functions deploy send-push-notification
   ```

4. Set required secrets if they are not already configured:

   ```bash
   supabase secrets set ONESIGNAL_APP_ID=your_onesignal_app_id
   supabase secrets set ONESIGNAL_REST_API_KEY=your_onesignal_rest_key
   ```

### 6.3 Function Request Format

```json
POST https://npfjacpfyrmopnoaktzc.supabase.co/functions/v1/send-push-notification

{
  "user_ids": ["uuid-1", "uuid-2"],
  "title": "New Arrival",
  "message": "Check out our latest printing products!",
  "data": { "route": "/products" },
  "url": "https://www.mayureshenterprises.com/products"
}
```

---

## 7. Local Development Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the dev server:**

   ```bash
   pnpm run dev
   ```

3. **Run lint:**

   ```bash
   pnpm run lint
   ```

4. **Build for production:**

   ```bash
   pnpm run build
   ```

---

## 8. How to Create / Connect a New Database

If you ever need to move to a brand-new Supabase project, follow these steps:

### 8.1 Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/) and click **New project**.
2. Choose an organization and set the project name (e.g., `Mayuresh Enterprises Production`).
3. Choose a strong database password and region closest to your users.
4. Wait for the database to finish provisioning.

### 8.2 Get New Credentials

1. In the new project, go to **Project Settings > API**.
2. Copy the **Project URL** and **anon public key**.
3. Update `.env`:

   ```bash
   VITE_SUPABASE_URL=https://<new-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<new-anon-key>
   ```

### 8.3 Recreate the Schema

Option A — Use Supabase migrations (recommended if you have existing migrations):

```bash
supabase link --project-ref <new-project-ref>
supabase db push
```

Option B — Manual recreation:

1. Open the **SQL Editor** in the new project dashboard.
2. Create each table matching the schema described in **Section 3**.
3. Enable RLS on every table and recreate the policies from **Section 4**.
4. Create the `is_admin()` helper function if it does not exist.
5. Create storage buckets `avatars` and `images` with public access and the same MIME/size settings.

### 8.4 Seed Initial Data

1. Insert seed data for categories, subcategories, products, services, banners, about page content, and company stats.
2. For product/service/category images, upload files to the `images` bucket and store the public URLs in the database.
3. If you need real images, use the `image_search` tool to find appropriate URLs.

### 8.5 Redeploy Edge Functions

```bash
supabase link --project-ref <new-project-ref>
supabase functions deploy send-push-notification
supabase secrets set ONESIGNAL_APP_ID=...
supabase secrets set ONESIGNAL_REST_API_KEY=...
```

### 8.6 Update Frontend Domain / SEO

- Update `siteUrl` in `src/lib/seo.ts` if the domain changes.
- Regenerate `public/sitemap.xml`:

  ```bash
  pnpm run generate-sitemap
  ```

---

## 9. Important Notes

- **Do not modify `supabase/migrations/` files directly.** Always apply schema changes through new migrations or the Supabase SQL Editor.
- **RLS policies must cover every role × operation combination.** Missing policies can cause silent failures (e.g., updates that return success but change nothing).
- **Never store secrets in the frontend.** Edge Functions are the only place for third-party API keys and service-role keys.
- **Use Supabase Storage for all images.** Avoid Base64 images in the database.
- If you add a new feature table, follow the same pattern: RLS enabled, policies for `anon`, `authenticated`, and `admin`, plus sensible defaults.
