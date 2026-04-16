<div align="center">

# 📧 ReachInbox

### Production-Grade Email Scheduling Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*A scalable, restart-safe email scheduling system with persistent job queues, Redis-backed rate limiting, and beautiful glass-morphism UI.*

[Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API](#-api-endpoints)

</div>

---

## 📸 Screenshots

<details>
<summary><strong>🔐 Create Account</strong></summary>
<br>
<img src="docs/screenshots/create-account.png" alt="Create Account" width="100%">
</details>

<details>
<summary><strong>🏠 Home Page</strong></summary>
<br>
<img src="docs/screenshots/home-page.png" alt="Home Page" width="100%">
</details>

<details>
<summary><strong>✍️ Compose Email</strong></summary>
<br>
<img src="docs/screenshots/compose-email.png" alt="Compose Email" width="100%">
</details>

<details>
<summary><strong>📅 Scheduled Emails</strong></summary>
<br>
<img src="docs/screenshots/scheduled-emails.png" alt="Scheduled Emails" width="100%">
</details>

<details>
<summary><strong>✅ Sent Emails</strong></summary>
<br>
<img src="docs/screenshots/sent-emails.png" alt="Sent Emails" width="100%">
</details>

<details>
<summary><strong>🔍 Search Emails</strong></summary>
<br>
<img src="docs/screenshots/search-emails.png" alt="Search Emails" width="100%">
</details>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📅 **Scheduled Delivery** | Schedule emails for future delivery with precise timing |
| 🔄 **Restart-Safe** | Jobs persist across server restarts - no lost emails |
| ⚡ **Rate Limiting** | Redis-backed per-sender hourly limits with auto-delay |
| 🔐 **Dual Authentication** | Google OAuth + Email/Password with JWT |
| 📊 **Real-time Dashboard** | Track scheduled and sent emails with status updates |
| � **Search & Filter** | Search emails by subject or recipient with status filtering |
| ❌ **Cancel Scheduled** | Cancel pending emails before they're sent |
| 📋 **Duplicate & Reschedule** | Clone any email and schedule it for a new time |
| 🔔 **Toast Notifications** | Real-time feedback for all user actions |
| 📄 **Pagination** | Handle large email lists efficiently (50 per page) |
| 🎯 **Idempotent Sends** | Prevents duplicate emails on retries |
| 🚀 **Scalable Architecture** | BullMQ workers with configurable concurrency |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API framework |
| **TypeScript** | Type-safe development |
| **Prisma** | Database ORM |
| **PostgreSQL** | Primary database |
| **BullMQ** | Job queue with delayed jobs |
| **Redis** | Queue persistence & rate limiting |
| **Nodemailer** | Email delivery (Ethereal for dev) |
| **JWT** | Authentication tokens |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **NextAuth.js** | Authentication |
| **Axios** | HTTP client |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional, for Redis)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/abhimh33/Email_Scheduling_System.git
cd Email_Scheduling_System
```

### 2️⃣ Backend Setup

```bash
cd backend
cp .env.example .env    # Configure your environment
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
cp .env.example .env    # Configure your environment
npm install
npm run dev
```

### 4️⃣ Access the App

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🔧 Backend API | http://localhost:4000 |

---

## ⚙️ Environment Variables

<details>
<summary><strong>Backend (.env)</strong></summary>

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/reachinbox

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email (Ethereal for development)
ETHEREAL_USER=your-ethereal-user
ETHEREAL_PASS=your-ethereal-pass

# Rate Limiting
EMAILS_PER_HOUR=100
MIN_DELAY_MS=500
```

</details>

<details>
<summary><strong>Frontend (.env)</strong></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

</details>

---

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js UI    │────▶│  Express API    │────▶│   PostgreSQL    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │     Redis       │
                        │  (BullMQ Queue) │
                        │                 │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Email Worker   │────▶ SMTP (Ethereal)
                        │                 │
                        └─────────────────┘
```

### 🔑 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **BullMQ for Queues** | Delayed jobs persist in Redis, surviving restarts |
| **jobId = emailId** | Ensures idempotency - same email can't be queued twice |
| **Status in Database** | Workers skip already-sent emails on restart |
| **Redis Rate Limiting** | Atomic `INCR` prevents race conditions under concurrency |
| **Auto-delay on Limit** | Jobs move to next hour window instead of failing |
| **Database Indexes** | Composite indexes on (userId, status/date) for fast queries |
| **Pagination** | All list endpoints paginated to handle large datasets |

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register with email/password |
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/google` | Authenticate with Google token |

### 📧 Emails

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/emails/schedule` | Schedule new emails |
| `GET` | `/api/emails/scheduled` | List scheduled emails (paginated) |
| `GET` | `/api/emails/sent` | List sent emails (paginated) |
| `GET` | `/api/emails/search` | Search emails by subject/recipient |
| `DELETE` | `/api/emails/:id` | Cancel a scheduled email |
| `POST` | `/api/emails/:id/duplicate` | Duplicate and reschedule an email |

#### Query Parameters

| Parameter | Endpoints | Description |
|-----------|-----------|-------------|
| `page` | scheduled, sent, search | Page number (default: 1) |
| `limit` | scheduled, sent, search | Items per page (default: 50, max: 100) |
| `q` | search | Search query (subject/recipient) |
| `status` | search | Filter by status: scheduled, sent, failed |

---

## 🧪 Testing the System

1. **Login** via Google OAuth or create an account with email/password
2. **Compose** an email with recipients, subject, and body
3. **Schedule** for a future time (even 1 minute from now)
4. **Observe** the email appear in "Scheduled" tab
5. **Search** for emails using the search bar
6. **Cancel** a scheduled email using the ❌ button
7. **Duplicate** any email using the 📋 button
8. **Restart** the backend server and verify emails continue sending
9. **Check terminal** for Ethereal preview URLs to view sent emails
10. **Trigger rate limit** by scheduling 100+ emails in one hour

### 📧 Viewing Test Emails

Since the app uses **Ethereal Email** (test SMTP), emails are not delivered to real inboxes. To preview sent emails:

1. Check the backend terminal output
2. Look for: `📧 Email sent! Preview at: https://ethereal.email/message/xxxxx`
3. Click the URL to view the email content in your browser

---

## 📁 Project Structure

```
Email_Scheduling_System/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── config/         # Environment & Redis config
│   │   ├── db/             # Prisma client
│   │   ├── queues/         # BullMQ queue setup
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Rate limiting, auth helpers
│   │   ├── workers/        # Email worker
│   │   └── server.ts       # Entry point
│   └── 📂 prisma/
│       └── schema.prisma   # Database schema
│
├── 📂 frontend/
│   └── 📂 src/
│       ├── components/     # React components
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Next.js pages
│       ├── services/       # API client
│       └── styles/         # Global styles
│
└── 📄 README.md
```

---

## 🔧 Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_CONCURRENCY` | 5 | Parallel email processing |
| `WORKER_ATTEMPTS` | 3 | Retry attempts on failure |
| `WORKER_BACKOFF_MS` | 5000 | Backoff delay between retries |
| `EMAILS_PER_HOUR` | 100 | Rate limit per sender |
| `MIN_DELAY_MS` | 500 | Minimum gap between sends |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🚧 Roadmap: Upcoming Features

The following features are planned for future releases:

| Feature | Description | Priority |
|---------|-------------|----------|
| 📁 **CSV Import** | Bulk import recipients from CSV files | High |
| 📧 **Real SMTP Support** | Gmail, SendGrid, AWS SES integration | High |
| 📎 **File Attachments** | Attach files to scheduled emails | Medium |
| 📝 **Email Templates** | Save and reuse email templates | Medium |
| 📈 **Analytics Dashboard** | Track open rates, click rates, delivery stats | Medium |
| 🔁 **Recurring Emails** | Schedule daily/weekly/monthly recurring emails | Medium |
| 📱 **Mobile Responsive** | Optimize UI for mobile devices | Low |
| 🌙 **Dark/Light Theme** | Theme toggle for user preference | Low |
| 🔗 **Webhook Integration** | Trigger emails via external webhooks | Low |
| 📤 **Email Tracking** | Track email opens and link clicks | Low |

---

<div align="center">

**Built with ❤️ using TypeScript**

[⬆ Back to Top](#-reachinbox)

</div>
