# StrideCo — Full-Stack E-Commerce Demo

A small e-commerce app for a shoe brand ("StrideCo"): public storefront + admin
dashboard with analytics, built with React (Vite + Tailwind) on the frontend
and Node/Express + MongoDB on the backend.

## What's in here

```
strideco/
  backend/     Express API, MongoDB models, JWT admin auth, seed script
  frontend/    React (Vite) storefront + admin dashboard
```

### Pages
- **Landing** — hero, featured products, value props
- **Shop (Products)** — filter by category, search, sort by price
- **Product detail** — sizes, colors, stock, "add to cart" (hits the orders API)
- **Admin login** — JWT-based
- **Admin dashboard** — revenue over time, units sold by category, top-selling
  products, orders/day, and a full product CRUD table (add/edit/delete)

### Backend
- REST API: `/api/products`, `/api/orders`, `/api/auth/login`, `/api/analytics/*`
- MongoDB via Mongoose (`Product`, `Order`, `Admin` models)
- JWT auth middleware protecting all write/admin routes
- Passwords hashed with bcrypt
- Seed script populates 9 products and ~60 orders spread across the last 30
  days so the dashboard charts aren't empty on first run

## Running it locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to a real MongoDB connection string
# (free tier at https://www.mongodb.com/cloud/atlas works fine)
npm run seed     # populates products, orders, and the admin account
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev               # starts on http://localhost:5173
```

Admin login: whatever you set `ADMIN_EMAIL` / `ADMIN_PASSWORD` to in
`backend/.env` before running `npm run seed` (defaults to
`admin@strideco.com` / `changeme123`).

## Deploying (Render + Vercel, both free tier)

**Backend → Render**
1. Push this repo to GitHub.
2. On Render: New → Web Service → connect the repo, root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from `backend/.env.example` (real values —
   `MONGO_URI` from Atlas, a random `JWT_SECRET`, `CLIENT_ORIGIN` set to your
   Vercel URL once you have it).
5. Deploy, then run the seed once via Render's Shell tab: `npm run seed`.

**Frontend → Vercel**
1. On Vercel: New Project → import the repo, root directory `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Add env var `VITE_API_URL` = your Render backend URL + `/api`.
4. Deploy. Then go back to Render and set `CLIENT_ORIGIN` to this Vercel URL
   so CORS allows it, and redeploy the backend.

`frontend/vercel.json` already handles client-side routing so `/products/xyz`
doesn't 404 on refresh.

## Design decisions 

- **Express over Next.js/NestJS**: the brief asked for "React and Node.js"
  separately, and a plain REST API is the clearest way to show backend work
  independent of the frontend framework.
- **MongoDB/Mongoose**: product catalogs are naturally document-shaped
  (variable sizes/colors arrays per product), and it's the fastest path to a
  working schema without migrations for a scoped project like this.
- **JWT instead of sessions**: no server-side session store needed, works
  cleanly across the separate frontend/backend deploy targets (Vercel +
  Render), and is the standard approach for a decoupled SPA + API.
- **Recharts for the dashboard**: composable React chart components, easy to
  wire directly to the aggregation endpoints above.
- **What's intentionally left out**: real payments, a persistent cart, email
  notifications, image uploads (images are hotlinked Unsplash URLs), and
  pagination. Flagging these as "next steps I'd add with more time" is a
  reasonable answer if asked — it shows scope awareness rather than gaps you
  didn't notice.

## Known limitations to be upfront about

- No pagination on `/api/products` — fine for a 9-product demo catalog, would
  need `limit`/`skip` or cursor pagination at real scale.

- No image upload — product images are external URLs. A real admin panel
  would need file upload + storage (S3/Cloudinary).
