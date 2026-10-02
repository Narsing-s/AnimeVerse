import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET","POST","PATCH","DELETE"];
export default async function(req,res){
  if(req.method==="GET"){
    const [a,c,t,g]=await Promise.all([db.query("SELECT * FROM anime ORDER BY created_at DESC"),db.query("SELECT * FROM characters ORDER BY created_at DESC"),db.query("SELECT * FROM trailers ORDER BY created_at DESC"),db.query("SELECT * FROM gallery_items ORDER BY created_at DESC")]);
    res.json({anime:a.rows,characters:c.rows,trailers:t.rows,gallery:g.rows});return;
  }
  const b=req.body||{}, kind=b.kind;
  const tables={anime:"anime",character:"characters",trailer:"trailers",gallery:"gallery_items"};
  const table=tables[kind];
  if(!table){res.status(400).json({error:"kind must be anime, character, trailer or gallery"});return}
  if(req.method==="POST"){
    if(kind==="anime"){const r=await db.query("INSERT INTO anime(title,subtitle,description,year,kind,genres,poster,backdrop,featured,published) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",[b.title,b.subtitle||"",b.description||"",Number(b.year)||2026,b.anime_kind||"Movie",b.genres||"Anime",b.poster||"",b.backdrop||"",!!b.featured,b.published!==false]);res.json(r.rows[0]);return}
    if(kind==="character"){const r=await db.query("INSERT INTO characters(name,role,description,image,anime_id) VALUES($1,$2,$3,$4,$5) RETURNING *",[b.name,b.role||"",b.description||"",b.image||"",b.anime_id||null]);res.json(r.rows[0]);return}
    if(kind==="trailer"){const r=await db.query("INSERT INTO trailers(title,youtube_url,description,anime_id,published) VALUES($1,$2,$3,$4,$5) RETURNING *",[b.title,b.youtube_url||"",b.description||"",b.anime_id||null,b.published!==false]);res.json(r.rows[0]);return}
    const r=await db.query("INSERT INTO gallery_items(title,image,anime_id,published) VALUES($1,$2,$3,$4) RETURNING *",[b.title||"Gallery",b.image||"",b.anime_id||null,b.published!==false]);res.json(r.rows[0]);return;
  }
  if(!b.id){res.status(400).json({error:"id is required"});return}
  if(req.method==="DELETE"){await db.query("DELETE FROM "+table+" WHERE id=$1",[b.id]);res.json({ok:true});return}
  if(kind==="anime"){const r=await db.query("UPDATE anime SET title=$1,subtitle=$2,description=$3,year=$4,kind=$5,genres=$6,poster=$7,backdrop=$8,featured=$9,published=$10,updated_at=now() WHERE id=$11 RETURNING *",[b.title,b.subtitle||"",b.description||"",Number(b.year)||2026,b.anime_kind||"Movie",b.genres||"Anime",b.poster||"",b.backdrop||"",!!b.featured,b.published!==false,b.id]);res.json(r.rows[0]);return}
  if(kind==="character"){const r=await db.query("UPDATE characters SET name=$1,role=$2,description=$3,image=$4,anime_id=$5,updated_at=now() WHERE id=$6 RETURNING *",[b.name,b.role||"",b.description||"",b.image||"",b.anime_id||null,b.id]);res.json(r.rows[0]);return}
  if(kind==="trailer"){const r=await db.query("UPDATE trailers SET title=$1,youtube_url=$2,description=$3,anime_id=$4,published=$5,updated_at=now() WHERE id=$6 RETURNING *",[b.title,b.youtube_url||"",b.description||"",b.anime_id||null,b.published!==false,b.id]);res.json(r.rows[0]);return}
  const r=await db.query("UPDATE gallery_items SET title=$1,image=$2,anime_id=$3,published=$4,updated_at=now() WHERE id=$5 RETURNING *",[b.title||"Gallery",b.image||"",b.anime_id||null,b.published!==false,b.id]);res.json(r.rows[0]);
}