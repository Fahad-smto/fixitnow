# FixItNow 🔧

**"Your Trusted Home Service Platform"** — Backend API

A backend API for a home services marketplace where customers can browse services, book technicians, pay online, and leave reviews. Technicians manage their profiles, services, and bookings. Admins moderate users and categories.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech))
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Tokens)
- **Payments:** Stripe (Checkout Sessions + Webhooks)
- **Password Hashing:** bcryptjs

---

## Project Structure (Modular Pattern)

Each feature lives in its own self-contained folder under `src/modules/`:

```
src/
├── app.ts
├── server.ts
├── config/
│   └── prisma.ts
├── lib/
│   └── stripe.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── types/
│   ├── common.interface.ts
│   └── express.d.ts
└── modules/
    ├── auth/          → auth.interface.ts, auth.service.ts, auth.controller.ts, auth.routes.ts
    ├── service/
    ├── technician/    → exports both a public router and a private (technician-only) router
    ├── category/
    ├── booking/
    ├── payment/       → Stripe Checkout + webhook confirmation
    ├── review/
    └── admin/
```

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd fixitnow-ts
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

```dotenv
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL="postgresql://user:password@host:5432/fixitnow?schema=public&sslmode=require"

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

### 3. Set up the database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

---

## Creating an Admin User

Registration only allows `customer` and `technician` roles (admins can't self-register for security reasons). To create an admin, run the seed script:

```bash
npx ts-node scripts/createAdmin.ts
```

This creates:
- **Email:** `admin@fixitnow.com`
- **Password:** `admin123`

⚠️ Change these credentials before deploying to production.

---

## Stripe Webhook Setup (Local Development)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Log in: `stripe login`
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/confirm
   ```
4. Copy the `whsec_...` signing secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in `.env`
5. Test with a real payment: call `POST /api/payments/create`, open the returned `paymentUrl` in a browser, and pay with a test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: any future date
   CVC: any 3 digits
   ```

In production, add the live webhook URL in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
```
https://your-deployed-url.com/api/payments/confirm
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (customer/technician) |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current authenticated user |

### Services & Technicians (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Browse services (filter by type, location, price) |
| POST | `/api/services` | Create a service (technician only) |
| GET | `/api/technicians` | Browse technicians |
| GET | `/api/technicians/:id` | Technician profile + reviews |
| GET | `/api/categories` | List service categories |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a booking (customer) |
| GET | `/api/bookings` | Get own bookings |
| GET | `/api/bookings/:id` | Get booking details |

### Payments (Stripe)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Create a Stripe Checkout session for an accepted booking |
| POST | `/api/payments/confirm` | Stripe webhook — confirms payment automatically |
| GET | `/api/payments` | Get own payment history |
| GET | `/api/payments/:id` | Get payment details |

### Technician (Private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/technician/profile` | Update technician profile |
| PUT | `/api/technician/availability` | Update availability slots |
| GET | `/api/technician/bookings` | Get technician's bookings |
| PATCH | `/api/technician/bookings/:id` | Accept / decline / update booking status |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Leave a review after job completion |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id` | Ban/unban a user |
| GET | `/api/admin/bookings` | List all bookings |
| GET | `/api/admin/categories` | List categories |
| POST | `/api/admin/categories` | Create a category |

---

## Booking Status Flow

```
REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
        ↘ DECLINED
```

Customers can cancel a booking any time before it reaches `IN_PROGRESS`.

---

## API Documentation

A Postman collection with all endpoints (including sample request bodies and auth token setup) is included: `FixItNow.postman_collection.json`.

To use it:
1. Import the collection and the environment file (`FixItNow.postman_environment.json`) into Postman
2. Select the **"FixItNow Local"** environment
3. Register → Login → copy the returned `token` into the environment's `token` variable
4. All protected routes will now send `Authorization: Bearer {{token}}` automatically

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with hot-reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build (`dist/server.js`) |
| `npm run prisma:generate` | Generate the Prisma Client |
| `npm run prisma:migrate` | Run database migrations |

---

## Notes

- Passwords are hashed with `bcryptjs` before storage.
- JWT tokens expire after 7 days.
- Role-based access control (`customer`, `technician`, `admin`) is enforced via middleware (`protect` + `authorize`).
- Stripe Checkout Sessions are used instead of raw PaymentIntents; the Checkout Session `id` (not the PaymentIntent `id`) is stored as the payment's `transactionId`, since the PaymentIntent isn't created until the customer actually completes checkout.