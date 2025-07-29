# Mrowka.pl

An open-source full-featured job platform, developed as a semester project for the Designing Information Systems university course. Inspired by Pracuj.pl, the app is built using Next.js (including API routes for backend logic), React, TypeScript, Tailwind CSS, and Supabase with its PostgreSQL database.

The project is being developed independently, with work spanning database design, authentication, and the full frontend interface. The core focus is on creating a functional, responsive, and well-structured information system.

## ✨ Key Features

### For Job Seekers

- **Job Discovery** - Advanced search with location, salary, contract type filters, and pagination.
- **Application Management** - Saving, applying for job offers, and lifecycle tracking with status updates.
- **Profile Builder** - Comprehensive profile editing with avatar and resume uploading.

### For Employers

- **Job Posting Suite** - Rich text editor with salary ranges, benefits, and requirements.
- **Candidate Pipeline** - Application review system.
- **Team Collaboration** - Multi-user company accounts with role-based permissions.
- **Employer Branding** - Customizable company pages.
- **Recruitment Analytics** - Application metrics, job performance tracking, and hiring insights.
- **Company Registration** - Multi-step verification process.

### Advanced Platform Features

- **Multi-level Authentication** - Separate access controls for job seekers, recruiters, and administrators.
- **Document Management** - Secure CV uploads with format validation and preview.
- **Application Status Tracking** - Pipeline updates from application to hire.
- **Geolocation Services** - Location-based job filtering and commute calculations.

---

## 🏗️ Technical Architecture

### Frontend Stack

- **Next.js 15** - App Router with server components and streaming.
- **React 19** - Concurrent features and modern hook patterns.
- **TypeScript** - Strict typing with custom interfaces and utility types.
- **Tailwind CSS** - Custom design system with component variants.
- **shadcn/ui + Radix UI** - Accessible component primitives with custom styling.
- **React Hook Form + Zod** - Type-safe form validation with runtime schema checking.

### Backend Infrastructure

- **Next.js API Routes** - RESTful endpoints with middleware authentication.
- **Supabase** - PostgreSQL with Row Level Security and real-time subscriptions.
- **Drizzle ORM** - Type-safe database queries with migration management.
- **Supabase Auth** - Transactional emails for notifications and confirmations.
- **Supabase Storage** - Document uploads with CDN delivery and automatic optimization.

### Architecture

- **25+ SSR Pages** with protected/public access levels.
- **25+ API endpoints** with RESTful design.
- **Role-based permissions** for job seekers, recruiters, and team members.

---

## 🧪 Testing & CI/CD

### End-to-End Testing (Playwright)

The platform uses **Playwright** with a **Page Object Model (POM)** architecture to verify critical user flows:

- **Coverage**: Authenticated "Happy Path" (applications, profile updates, saved jobs) and public job discovery.
- **Data Automation**: Custom seeder (`seed-test-users.ts`) bypasses email confirmation and resets test data automatically.

#### Commands

```bash
npm run dev       # Start development server
npm run test:e2e  # Run full E2E suite (seeds data automatically)
```

### CI/CD

- **GitHub Actions**: Automated pipeline runs the full suite on every push and PR.
