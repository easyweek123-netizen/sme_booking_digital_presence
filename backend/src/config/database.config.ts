import { registerAs } from '@nestjs/config';

/**
 * Supported database types
 */
export type DatabaseType = 'postgres' | 'mysql';

/**
 * Default ports per database type
 */
const DEFAULT_PORTS: Record<DatabaseType, number> = {
  postgres: 5432,
  mysql: 3306,
};

/**
 * Validates required environment variable exists
 * @throws Error if variable is missing
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env file.`,
    );
  }
  return value;
}

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
 * Required Environment Variables:
 * - DB_HOST: Database host
 * - DB_USERNAME: Database user
 * - DB_PASSWORD: Database password
 * - DB_DATABASE: Database name
 *
 * Optional Environment Variables:
 * - DB_TYPE: 'postgres' (default) | 'mysql'
 * - DB_PORT: Database port (default: 5432 for postgres, 3306 for mysql)
 * - DB_SSL: Enable SSL connection (default: 'false', set 'true' for production)
 * - NODE_ENV: Environment (affects synchronize and logging)
 */
export default registerAs('database', () => {
  const type = getDatabaseType();
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    type,
    host: requireEnv('DB_HOST'),
    port: parseInt(process.env.DB_PORT || String(DEFAULT_PORTS[type]), 10),
    username: requireEnv('DB_USERNAME'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
    ssl:
      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // Never auto-sync in production
    synchronize: !isProduction,
    // Only log in development
    logging: isDevelopment,
  };
});
