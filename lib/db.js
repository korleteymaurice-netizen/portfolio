import pg from 'pg';
const { Pool } = pg;
let pool;

function isLocalDatabaseUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local');
  } catch {
    return false;
  }
}

export function getPool(){
  if(!pool){
    if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');

    const connectionString = process.env.DATABASE_URL;
    const sslEnabled = !isLocalDatabaseUrl(connectionString);

    pool = new Pool({
      connectionString,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function query(text, params=[]){ return getPool().query(text,params); }
