# AnimeVerse

AnimeVerse is a cinematic anime discovery application for anime movies, Ghibli titles, characters, trailers, galleries, search, favorites, and admin content management.

## Included

- Anime discovery and filtering
- Ghibli and movie categories
- Character profiles
- Trailer section
- Visual gallery
- Search
- Favorites
- Surprise-me discovery
- Responsive mobile-first UI
- Admin content studio
- Anime, character, trailer, and gallery CRUD
- Publish/featured content controls
- PostgreSQL migration and seed files
- Public content API, favorites API, and protected admin API

## Project structure

- `public/index.html` — main application
- `public/styles.css` — complete UI
- `public/app.js` — client application logic
- `public/admin/` — admin content studio
- `api/` — backend API routes
- `migrations/` — database schema and starter content

## Data

The `migrations/` directory contains the complete database schema and starter catalog. Run migrations in filename order when moving the application to a PostgreSQL-backed runtime.

## Repository quality

The repository also includes an MIT license, contribution guide, security policy, environment template, PWA manifest, and a friendly 404 page.

## Deployment

The frontend is plain HTML/CSS/JavaScript and can be served by any static host. The backend is now standalone: PostgreSQL is accessed through `pg`, authentication uses signed HTTP-only JWT cookies, and admin endpoints enforce the database role. Configure `DATABASE_URL` and a strong `JWT_SECRET` before deployment. The repository no longer requires the Hatchable runtime.

## Content and artwork

Starter artwork uses remote image URLs for demonstration. Replace those URLs with assets you are licensed to use before production publication.

## Local setup

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
3. Run migrations `001` through `020` in order against PostgreSQL.
4. Run `npm install` and `npm test`.
5. Run with Vercel CLI using `vercel dev`, or deploy using the included `vercel.json`.
6. The health endpoint is `/api/health`.

The first account is a normal user. Promote an administrator directly in PostgreSQL with `UPDATE users SET role='admin' WHERE email='your-admin@example.com';`.

## License

No license has been added yet. Add the license that matches the project's intended distribution before accepting external contributions.
