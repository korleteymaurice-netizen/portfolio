import crypto from 'crypto';
import { query } from './db.js';
const cookieName='oc_admin';
const secret=()=>process.env.AUTH_SECRET||'development-only-change-me';
const sign=(payload)=>{const body=Buffer.from(JSON.stringify(payload)).toString('base64url');const sig=crypto.createHmac('sha256',secret()).update(body).digest('base64url');return body+'.'+sig;};
const parse=(token)=>{try{if(!token)return null;const [body,sig]=token.split('.');if(!body||!sig)return null;const expected=crypto.createHmac('sha256',secret()).update(body).digest('base64url');if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;const payload=JSON.parse(Buffer.from(body,'base64url').toString());return payload?.exp>Date.now()?payload:null;}catch{return null;}};
export function setAuthCookie(res,user){const token=sign({sub:user.id,email:user.email,exp:Date.now()+8*60*60*1000});res.setHeader('Set-Cookie',`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV==='production'?'Secure; ':''}Max-Age=28800`);}
export function clearAuthCookie(res){res.setHeader('Set-Cookie',`${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);}
function cookies(req){const result={};for(const part of (req.headers.cookie||'').split(';')){if(!part.trim())continue;const i=part.indexOf('=');if(i<0)continue;const key=part.slice(0,i).trim();try{result[key]=decodeURIComponent(part.slice(i+1));}catch{result[key]=part.slice(i+1);}}return result;}
export async function requireAuth(req,res){try{const p=parse(cookies(req)[cookieName]);if(!p) {res.status(401).json({error:'Unauthorized'});return null;} const r=await query('SELECT id,email FROM users WHERE id=$1',[p.sub]);if(!r.rows[0]){res.status(401).json({error:'Unauthorized'});return null;}return r.rows[0];}catch(e){res.status(500).json({error:'Authentication error'});return null;}}
