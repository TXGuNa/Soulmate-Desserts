# Soulmate Desserts – Firebase Plan (Reference)

## Chosen Stack
- Frontend: React (Vite) on Firebase Hosting + CDN
- Auth: Firebase Authentication (email/password, OAuth later, MFA for owners)
- Backend/API: Cloud Functions (Node.js/Express-style handlers)
- Database: Firestore (NoSQL); optional Cloud SQL later for complex reporting
- Storage: Firebase Storage for product images/uploads
- Payments: Stripe (later) via Firebase Extensions + Stripe Webhooks (Cloud Functions)

## Roles & Ownership
- Roles: owner > admin > dealer > customer
- Owner can manage multiple countries (ownedCountries array)
- Permissions per role (manageProducts, manageOrders, manageUsers, managePayments, viewAnalytics)
- Country scoping: products and orders carry countryCode; rules enforce ownership

## Security (MVP)
- Require email verification for sign-in
- Password policy: 8+ chars, uppercase, number, special
- MFA required for owner/admin
- Session max age 24h; refresh tokens managed by Firebase
- Rate limiting via callable functions / API Gateway-like middleware (Cloud Functions)
- Firestore rules (example):
  - Products: public read; write only if role is owner/admin AND intersects ownedCountries/regions
  - Orders: user can read own; owner/admin can read for their countries; create allowed if auth
- Stripe: never store card data; verify webhook signatures

## Data Model (Firestore)
- collections
  - users/{userId}: role, countryCode, ownedCountries, permissions
  - products/{productId}: regions[], prices, tag, images, etc.
  - orders/{orderId}: userId, countryCode, items[], total, status
  - countryContacts/{countryCode}: email, phone, isDefault
  - settings/{settingId}: contactInfo (email/phone), currency, currencies[], store config
- indexes: countryCode filters on products/orders; regions array queries

## Migration Steps (Phase 1)
1) Create Firebase project; enable Auth (email/password), Firestore, Hosting, Functions
2) Export db.json → scripts to seed Firestore (products, countryContacts, settings)
3) Implement Firebase Auth in frontend (context replacement of current auth)
4) Swap API client to call Cloud Functions (products, orders, countryContacts, settings)
5) Update contact info/footer to read from Firestore settings/contactInfo

## Migration Steps (Phase 2)
1) Image handling: move product images to Firebase Storage; store URLs in Firestore
2) Add MFA requirement for owner/admin flows
3) Add rate limiting middleware in Functions
4) Add per-country ownership enforcement in Functions and Firestore rules

## Payments (Phase 3)
- Use Stripe + Firebase Extensions for basic checkout
- For multi-country: Stripe Connect accounts per country; store stripeAccountId per country
- Webhooks in Cloud Functions; verify signatures; update orders in Firestore

## Dev/Deploy
- Environments: dev and prod Firebase projects
- Deploy: `firebase deploy --only hosting,functions,firestore:rules,storage:rules`
- Config via Firebase Config for secrets (Stripe keys, etc.)

## Cost Notes (early stage)
- Mostly within Firebase free tier; expect ~$30/mo at moderate scale (Functions + Firestore)

## Next Actions
1) Scaffold Firebase (project, Auth, Firestore, Hosting, Functions)
2) Write seeding script from db.json to Firestore
3) Replace auth context with Firebase Auth
4) Replace API calls with Cloud Functions
5) Deploy dev environment and smoke-test
