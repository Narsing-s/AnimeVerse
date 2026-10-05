import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const anime = require("../data/anime.json");
const characters = require("../data/characters.json");
const trailers = require("../data/trailers.json");
const gallery = require("../data/gallery.json");

const clean = (value) => String(value ?? "").trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const q = clean(req.query?.q);
    const type = clean(req.query?.type || "all");
    const hit = (value) => !q || clean(value).includes(q);

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).json({
      anime: anime.filter((item) => (type === "all" || clean(item.kind) === type) && [item.title, item.subtitle, item.description, item.genres].some(hit)),
      characters: characters.filter((item) => [item.name, item.role, item.description].some(hit)),
      trailers: trailers.filter((item) => [item.title, item.description, item.anime_title].some(hit)),
      gallery: gallery.filter((item) => hit(item.title)),
    });
  } catch (error) {
    console.error("AnimeVerse catalog load failed:", error);
    return res.status(500).json({ error: "Catalog unavailable", message: "The catalog could not be loaded right now." });
  }
}
