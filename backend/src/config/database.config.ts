import { registerAs } from '@nestjs/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * PostgreSQL-only database configuration.
 *
 * Required env vars: DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE
 * Optional env vars:
 *   DB_PORT  — default 5432
 *   DB_SSL   — set 'true' in production to enable SSL
 *   DB_SYNC  — set 'true' ONLY for local schema exploration; never in production
 */
export default registerAs('database', () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  

  return {
    type: 'postgres' as const,
    host: requireEnv('DB_HOST'),
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: requireEnv('DB_USERNAME'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: isDevelopment,
  };
});
