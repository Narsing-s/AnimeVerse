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

The frontend is plain HTML/CSS/JavaScript and can be served by any static host. The current API files still use the Hatchable runtime SDK for authentication and PostgreSQL access. The UI, migrations, documentation, and static assets are fully stored in GitHub, but the backend is not yet standalone; migrate `api/` to the target platform's database/auth layer before removing the remaining Hatchable runtime dependency.

## Content and artwork

Starter artwork uses remote image URLs for demonstration. Replace those URLs with assets you are licensed to use before production publication.

## License

No license has been added yet. Add the license that matches the project's intended distribution before accepting external contributions.
