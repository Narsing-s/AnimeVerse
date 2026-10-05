export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json({
    clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID || null,
    configured: Boolean(process.env.GOOGLE_PHOTOS_CLIENT_ID)
  });
}
