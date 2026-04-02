# PJMS Platform

School permission workflow platform with:
- Backend: Node.js, Express, MongoDB, JWT
- Frontend: React (Vite), Tailwind CSS, React Query, React Router, Zustand, React Hook Form, Zod

## What it solves

- Digitizes student leave and missed-exam permissions.
- Enforces role-based workflow (`Admin`, `DOD`, `DOS`, `Teacher`, `Security`).
- Tracks gate movements (exit/return) and keeps audit records for accountability.

## Professional improvements added

- Request validation middleware for all write endpoints.
- Refresh-token authentication flow (`login`, `refresh`, `logout`).
- Login rate limiting to reduce brute-force attacks.
- Centralized error middleware and 404 handling.
- Safer business logic checks (school-level isolation and workflow-state guards).
- Better health endpoint payload and security response headers.
- Extra DB indexes for frequent query paths.

## API summary

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/admin/user`
- `GET /api/admin/users`
- `POST /api/admin/role`
- `POST /api/permissions`
- `PUT /api/dos/approve`
- `PUT /api/teacher/allow-exam`
- `POST /api/security/exit`
- `POST /api/security/return`
- `GET /health`

## Backend Setup

1. Install dependencies:
   `pnpm install` (or `npm install`)
2. Create env file:
   `cp .env.example .env`
3. Start server:
   `pnpm dev`

## Frontend Setup

1. Go to frontend:
   `cd frontend`
2. Install dependencies:
   `pnpm install`
3. Create env file:
   `cp .env.example .env`
4. Start UI:
   `pnpm dev`

Frontend default URL: `http://localhost:5173`
Backend API default URL used by frontend: `http://localhost:5000/api`

## Testing

- Full suite: `npm test`
- Fast middleware-only checks: `npm run test:quick`
