import { registerAs } from '@nestjs/config';

/**
 * Supported database types
 */
export type DatabaseType = 'postgres' | 'mysql';

/**
 * Database configuration defaults per type
 */
const DATABASE_DEFAULTS: Record<
  DatabaseType,
  { port: number; username: string; password: string }
> = {
  postgres: {
    port: 5432,
    username: 'postgres',
    password: 'postgres',
  },
  mysql: {
    port: 3306,
    username: 'root',
    password: 'root',
  },
};

/**
 * Validates and returns the database type from environment
 * @throws Error if DB_TYPE is invalid
 */
function getDatabaseType(): DatabaseType {
  const dbType = process.env.DB_TYPE || 'postgres';

  if (dbType !== 'postgres' && dbType !== 'mysql') {
    throw new Error(
      `Invalid DB_TYPE: "${dbType}". Supported values are: "postgres", "mysql"`,
    );
  }

  return dbType;
}

/**
 * Database configuration
 *
 * Defaults to PostgreSQL for Render deployment compatibility.
 * Set DB_TYPE=mysql for MySQL.
 *
 * Environment Variables:
 * - DB_TYPE: 'postgres' (default) | 'mysql'
 * - DB_HOST: Database host (default: 'localhost')
 * - DB_PORT: Database port (default: 5432 for postgres, 3306 for mysql)
 * - DB_USERNAME: Database user (default: 'postgres' or 'root')
 * - DB_PASSWORD: Database password (default: 'postgres' or 'root')
 * - DB_DATABASE: Database name (default: 'bookeasy')
 * - DB_SSL: Enable SSL connection (default: 'false', set 'true' for production)
 * - NODE_ENV: Environment (affects synchronize and logging)
 */
export default registerAs('database', () => {
  const type = getDatabaseType();
  const defaults = DATABASE_DEFAULTS[type];
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    type,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || String(defaults.port), 10),
    username: process.env.DB_USERNAME || defaults.username,
    password: process.env.DB_PASSWORD || defaults.password,
    database: process.env.DB_DATABASE || 'bookeasy',
    ssl:
      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // Never auto-sync in production
    synchronize: !isProduction,
    // Only log in development
    logging: isDevelopment,
  };
});
