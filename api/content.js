import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const loadJson = (name) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}.json`, import.meta.url)), "utf8"));

const anime = loadJson("anime");
const characters = loadJson("characters");
const trailers = loadJson("trailers");
const gallery = loadJson("gallery");

const clean = (value) => String(value ?? "").trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const q = clean(req.query?.q);
    const type = clean(req.query?.type || "all");
    const hit = (value) => !q || clean(value).includes(q);

    const result = {
      anime: anime.filter(
        (item) =>
          (type === "all" || clean(item.kind) === type) &&
          [item.title, item.subtitle, item.description, item.genres].some(hit),
      ),
      characters: characters.filter((item) =>
        [item.name, item.role, item.description].some(hit),
      ),
      trailers: trailers.filter((item) =>
        [item.title, item.description, item.anime_title].some(hit),
      ),
      gallery: gallery.filter((item) => hit(item.title)),
    };

    res.setHeader(
      "Cache-Control",
      "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("AnimeVerse catalog load failed:", error);
    return res.status(500).json({
      error: "Catalog unavailable",
      message: "The catalog could not be loaded right now.",
    });
  }
}
