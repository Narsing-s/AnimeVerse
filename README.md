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

## Deployment

The frontend is plain HTML/CSS/JavaScript and can be served by any static host. The API files currently use the Hatchable runtime SDK for authentication and PostgreSQL access, so a deployment outside Hatchable requires replacing those runtime calls with the target platform's authentication/database layer.

## Content and artwork

Starter artwork uses remote image URLs for demonstration. Replace those URLs with assets you are licensed to use before production publication.

## License

No license has been added yet. Add the license that matches the project's intended distribution before accepting external contributions.
