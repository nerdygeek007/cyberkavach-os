// backend/src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const dbPool = new Pool({
  user: process.env.DB_USER || 'cyber_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cyberkavach_db',
  password: process.env.DB_PASSWORD || 'cyber_secure_password',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  max: 20,
  idleTimeoutMillis: 30000,
});

dbPool.on('connect', () => {
  console.log('[*] System Boundary: PostgreSQL Connection Pool Established.');
});

dbPool.on('error', (err) => {
  console.error('[!] FATAL: Unexpected error on idle client', err);
  process.exit(-1);
});