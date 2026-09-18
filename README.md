# Ximato

Ximato is a full-stack food ordering application built with Next.js, React, TypeScript, and MongoDB. Customers can browse menu categories, add items to a cart, place orders, and track order status. Administrators can manage categories, menu items, and order status from the admin area.

## Features

- Responsive customer menu and category browsing
- Menu item details with availability and vegetarian indicators
- Shopping cart and checkout flow
- Order lookup and order tracking
- Admin dashboard with order and menu statistics
- Admin category management
- Admin menu item creation, editing, availability, and featured-item controls
- Admin order status management
- MongoDB persistence for categories, menu items, orders, and counters
- API health endpoint for service monitoring

## Technology Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- MongoDB with the official `mongodb` Node.js driver
- Zod for request validation
- Tailwind CSS 4 and PostCSS
- Lucide React icons

## Requirements

- Node.js 20 or newer
- npm
- MongoDB running locally or a reachable MongoDB deployment

The default local MongoDB connection is:

```text
mongodb://localhost:27017/
```

## Installation

```bash
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=Ximato
```

`MONGODB_URI` and `MONGODB_DB` default to these values when omitted, but keeping them in `.env.local` makes the configuration explicit.

## Seed the Database

The seed script clears the `categories` and `menuItems` collections and loads the sample menu data.

```bash
npx tsx src/db/seed.ts
```

Do not run the seed script against a database containing data you need to keep.

## Run the Application

Start the Next.js application on the default development port:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The application includes both the frontend and backend API routes. There is no separate Express server. API routes are available under `/api`, for example:

```text
http://localhost:3000/api/health
```

To run a second API-compatible Next.js instance on port 5000, use a separate build directory so both development servers can run at the same time.

PowerShell:

```powershell
$env:NEXT_DIST_DIR=".next-5000"
npm run dev -- -p 5000
```

The backend-compatible health endpoint is:

```text
http://localhost:5000/api/health
```

Both ports serve the same Next.js application and API route code. Port 5000 is not a separate backend framework.

## Useful Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript checks
```

## Main Routes

### Customer

- `/` - Home page and featured menu
- `/menu/[slug]` - Menu category page
- `/cart` - Shopping cart
- `/checkout` - Checkout form
- `/track` - Order lookup
- `/orders/[id]` - Order details and status

### Admin

- `/admin` - Dashboard
- `/admin/categories` - Category management
- `/admin/items` - Menu item management
- `/admin/items/new` - Create a menu item
- `/admin/items/[id]/edit` - Edit a menu item
- `/admin/orders` - Order management
- `/admin/orders/[id]` - Order details and status updates

## API Overview

- `GET /api/health`
- `GET, POST /api/orders`
- `GET /api/orders/[id]`
- `GET, POST /api/admin/categories`
- `PATCH, DELETE /api/admin/categories/[id]`
- `POST /api/admin/items`
- `PATCH, DELETE /api/admin/items/[id]`
- `PATCH /api/admin/orders/[id]`

## Database Structure

The MongoDB database is named `Ximato` and uses these collections:

- `categories`
- `menuItems`
- `orders`
- `counters`

Order line items are embedded inside order documents. Numeric IDs are maintained for compatibility with the existing application routes and client payloads.

## Project Structure

```text
src/
  app/          Pages and API route handlers
  components/   Shared customer and admin React components
  db/           MongoDB connection, collections, and seed script
  lib/          Data access, formatting, constants, and shared types
public/         Static assets
```

## Validation

Before opening a pull request or deploying, run:

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes

- MongoDB must be running before using database-backed pages or API routes.
- The health endpoint returns `{ "ok": true }` only when MongoDB is reachable.
- The current application does not include authentication or authorization for the admin routes. Add authentication before exposing the admin area publicly.

## 📄 License

Copyright © 2026 Ximato. Fresh food, delivered fast. All rights reserved.
