import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function(req,res){
  const q=(req.query?.q||"").trim();
  const type=req.query?.type||"all";
  const like="%"+q.replace(/[%_]/g,"")+"%";
  const [anime,characters,trailers,gallery]=await Promise.all([
    db.query("SELECT id,title,subtitle,description,year,kind,genres,poster,backdrop,featured FROM anime WHERE published=true AND ($1='' OR title ILIKE $2 OR description ILIKE $2) AND ($3='all' OR kind=$3) ORDER BY featured DESC, year DESC, title",[q,like,type]),
    db.query("SELECT id,name,role,description,image,anime_id FROM characters ORDER BY name"),
    db.query("SELECT t.id,t.title,t.youtube_url,t.description,a.title anime_title FROM trailers t LEFT JOIN anime a ON a.id=t.anime_id WHERE t.published=true ORDER BY t.created_at DESC"),
    db.query("SELECT id,title,image,anime_id FROM gallery_items WHERE published=true ORDER BY created_at DESC")
  ]);
  res.json({anime:anime.rows,characters:characters.rows,trailers:trailers.rows,gallery:gallery.rows});
}