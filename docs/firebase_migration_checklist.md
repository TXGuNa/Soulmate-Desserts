# Firebase Migration Checklist (Actionable Steps)

## Prerequisites
- Install Firebase CLI: `npm install -g firebase-tools`
- Login: `firebase login`
- Create Firebase project (dev/prod) in console
- Note project IDs: `PROJECT_ID_DEV`, `PROJECT_ID_PROD`

## 1) Initialize Firebase in repo
- Run `firebase init` and enable:
  - Hosting (build: `dist`, SPA rewrite to `/index.html`)
  - Functions (Node.js 18+; JavaScript or TypeScript)
  - Firestore (security rules + indexes)
  - Storage (optional, for images)
- Choose dev project when prompted (can switch with `firebase use` later).

## 2) Seed Firestore from db.json
- Create a script `scripts/seed-firestore.js` that:
  - Reads `db.json`
  - Writes collections: `products`, `ingredients`, `orders`, `countryContacts`, `settings`
  - Uses `firebase-admin` with service account (dev project) or `gcloud auth application-default login`
- Run: `node scripts/seed-firestore.js`

## 3) Swap Auth to Firebase Auth (frontend)
- Add Firebase SDK config (`src/firebase.js`) with dev project keys
- Replace custom AuthContext with Firebase Auth:
  - email/password login, signup, logout
  - persist session; require email verification for privileged actions
- Enforce MFA for owner/admin later (Phase 2)

## 4) Move API calls to Cloud Functions
- Create HTTPS callable/REST functions:
  - `getProducts`, `create/update/deleteProduct`
  - `getOrders`, `updateOrderStatus`, `createOrder`
  - `getCountryContacts`, `create/update/deleteCountryContact`
  - `getSettings`, `updateSettings`
- Add auth/role guards in functions (owner/admin for writes)
- Update `src/api/client.js` to call Functions instead of local JSON server

## 5) Firestore Security Rules (MVP)
- Public read on products; writes require owner/admin and region ownership
- Orders: user can read own; owner/admin can read/manage orders for their countries
- Settings/countryContacts: write owner/admin; read public
- Enforce emailVerified for elevated writes

## 6) Storage (Phase 2)
- Move product images to Firebase Storage
- Store URLs in Firestore products
- Add storage rules: only owner/admin can write; public read

## 7) Stripe (Phase 3)
- Install Stripe Firebase Extension or custom Functions
- Add per-country Stripe account/config (Stripe Connect recommended)
- Verify webhooks in Functions; update Firestore orders

## 8) Deployment
- Dev deploy: `firebase deploy --only hosting,functions,firestore:rules,storage:rules`
- Swap to prod: `firebase use PROJECT_ID_PROD`
- Set env config (keys, Stripe) with `firebase functions:config:set ...`

## 9) Hardening (Phase 2+)
- Enable MFA for owner/admin accounts
- Add rate limiting middleware in Functions
- Add monitoring/log-based alerts

## References
- See `docs/firebase_plan.md` for architecture rationale.
