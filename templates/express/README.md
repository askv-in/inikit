# Inikit Express Template

Minimal Express.js template (JavaScript) scaffold for Inikit.

## Quickstart

1. Copy repo
2. `cp .env.example .env` and edit values
3. Install: `npm ci`
4. Dev: `npm run dev` (requires nodemon)
5. Production: `npm start`

## Endpoints
- `GET /` — root health/status
- `GET /api/health` — API health

## Add routes
Create new route files under `src/routes` and register them in `src/app.js`.
