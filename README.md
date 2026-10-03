# 🌸 AnimeVerse

> **A cinematic anime discovery universe — built to make every world feel worth remembering.**

AnimeVerse is a lightweight, production-oriented anime discovery platform for movies, series, Ghibli worlds, characters, trailers, galleries and personal favorites. It combines a cinematic mobile-first experience with a PostgreSQL-backed content studio and authenticated user features.

## ✨ Product experience

- 🔎 **Instant discovery** — search anime and characters from one focused command-style search.
- 🎲 **Surprise Me** — jump into a random published world.
- 🧭 **Smart browsing** — filter by All, Ghibli, Movies and Series.
- ♡ **Personal collection** — save favorites locally for instant access; signed-in users can sync through the API.
- 🎬 **Trailer theater** — open published YouTube trailers in a focused viewer.
- ✦ **Character universe** — explore character profiles alongside their worlds.
- 🖼️ **Visual gallery** — responsive masonry-style artwork browsing.
- 📱 **PWA-ready** — installable shell with offline caching for the core experience.
- ⚡ **Fast perceived performance** — lazy-loaded media, skeleton states, responsive layouts and reduced-motion support.
- 🛡️ **Content Studio** — protected admin CRUD with publishing and featured controls.
- ♿ **Accessible interactions** — semantic navigation, labels, keyboard shortcuts and dialog behavior.
- 📊 **At-a-glance stats** — live catalog counts on the hero and collection surface.

## 🏗️ Architecture

- **Frontend:** HTML, modern CSS, vanilla JavaScript
- **Backend:** Vercel Functions / Node.js
- **Database:** PostgreSQL via `pg`
- **Authentication:** signed HTTP-only JWT cookies
- **PWA:** Web App Manifest + Service Worker
- **Deployment:** Vercel-compatible static frontend + API
- **Runtime:** Node.js 20+

## 🗂️ Structure

```
public/
  index.html        # cinematic application shell
  styles.css        # responsive design system
  app.js            # discovery, search, favorites and interactions
  sw.js             # offline shell caching
  manifest.json     # installable PWA metadata
  admin/            # content studio
api/
  content.js        # public catalog API
  favorites.js      # authenticated favorites API
  auth/             # authentication endpoints
  admin/            # protected content management
  _lib/             # database/auth helpers
migrations/         # PostgreSQL schema + seed migrations
test/               # automated checks
```

## 🚀 Run locally

1. Install **Node.js 20+**.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` and a strong `JWT_SECRET`.
4. Apply migrations in filename order.
5. Install dependencies:

```bash
npm install
```

6. Run validation:

```bash
npm test
npm run check
```

7. Start the local Vercel runtime:

```bash
npx vercel dev
```

Then open the local URL shown by Vercel. The health endpoint is `/api/health`.

## 🔐 Production checklist

- Set a strong, unique `JWT_SECRET`.
- Use a managed PostgreSQL connection with TLS.
- Replace demonstration artwork with assets you are licensed to publish.
- Keep admin credentials out of source control.
- Review CORS, cookie, CSP and security headers before public launch.
- Monitor API/database errors and slow queries.
- Keep the public catalog limited to `published=true`.
- Add backups and a migration rollback plan for production data.

## 🗺️ Roadmap

### Discovery
- [x] Search
- [x] Genre/type filters
- [x] Surprise Me
- [x] Characters
- [x] Trailers
- [x] Gallery
- [x] Favorites
- [ ] Advanced multi-filter discovery
- [ ] Seasonal calendar
- [ ] Personalized recommendations

### Community
- [ ] User profiles
- [ ] Ratings and reviews
- [ ] Public collections
- [ ] Follow/friend activity
- [ ] Spoiler-aware discussions

### Intelligence
- [ ] Taste-based recommendation engine
- [ ] Similar-anime graph
- [ ] Natural-language discovery ("something calm and magical")
- [ ] Personalized home feed

### Platform
- [x] PWA shell
- [ ] Push notifications
- [ ] Offline catalog snapshots
- [ ] Analytics dashboard
- [ ] Automated database backups
- [ ] Observability and alerting

## ⚖️ Content & licensing

Anime names, characters, artwork, trailers and related intellectual property belong to their respective rights holders. AnimeVerse should only publish artwork and media that the project has permission or a valid license to use. Replace demonstration remote image URLs before production publication.

## 📄 License

MIT — see [LICENSE](LICENSE).

---

**AnimeVerse** · Discover a world. Save the feeling. ✦
