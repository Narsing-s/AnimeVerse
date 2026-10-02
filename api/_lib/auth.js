import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const secret=()=>process.env.JWT_SECRET||"development-only-change-me";
export function signUser(user){return jwt.sign({sub:user.id,email:user.email,role:user.role},secret(),{expiresIn:"7d"})}
export function readUser(req){try{const h=req.headers.authorization||"";const token=h.startsWith("Bearer ")?h.slice(7):req.cookies?.animeverse_token;if(!token)return null;return jwt.verify(token,secret())}catch{return null}}
export async function requireUser(req,res){const u=readUser(req);if(!u){res.status(401).json({error:"Authentication required"});return null}return u}
export async function requireAdmin(req,res){const u=await requireUser(req,res);if(!u)return null;if(u.role!=="admin"){res.status(403).json({error:"Admin access required"});return null}return u}
export const hashPassword=p=>bcrypt.hash(p,12);export const verifyPassword=(p,h)=>bcrypt.compare(p,h);
export function setAuthCookie(res,token){res.setHeader("Set-Cookie",`animeverse_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`)}
