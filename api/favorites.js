import { db, auth } from "hatchable";
export const access = "public";
export const methods = ["GET","POST","DELETE"];
export default async function(req,res){
  const user=await auth.getUser(req);
  if(!user){res.status(401).json({error:"Sign in to sync favorites"});return}
  if(req.method==="GET"){const r=await db.query("SELECT content_type,content_id FROM favorites WHERE user_id=$1 ORDER BY created_at DESC",[user.id]);res.json(r.rows);return}
  const b=req.body||{};
  if(!b.content_type||!b.content_id){res.status(400).json({error:"content_type and content_id are required"});return}
  if(req.method==="POST"){await db.query("INSERT INTO favorites(user_id,content_type,content_id) VALUES($1,$2,$3) ON CONFLICT(user_id,content_type,content_id) DO NOTHING",[user.id,b.content_type,b.content_id]);res.json({ok:true});return}
  await db.query("DELETE FROM favorites WHERE user_id=$1 AND content_type=$2 AND content_id=$3",[user.id,b.content_type,b.content_id]);res.json({ok:true});
}