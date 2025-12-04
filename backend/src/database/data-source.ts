import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Supported database types
 */
type DatabaseType = 'postgres' | 'mysql';

/**
 * Default ports per database type
 */
const DEFAULT_PORTS: Record<DatabaseType, number> = {
  postgres: 5432,
  mysql: 3306,
};

/**
 * Validates required environment variable exists
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    console.error('   Please check your .env file.');
    process.exit(1);
  }
  return value;
}

/**
 * Get and validate database type from environment
 */
function getDatabaseType(): DatabaseType {
  const dbType = process.env.DB_TYPE || 'postgres';

  if (dbType !== 'postgres' && dbType !== 'mysql') {
    console.error(`❌ Invalid DB_TYPE: "${dbType}"`);
    console.error('   Supported values: "postgres", "mysql"');
    process.exit(1);
  }

  return dbType;
}

// Get configuration
const type = getDatabaseType();
const host = requireEnv('DB_HOST');
const username = requireEnv('DB_USERNAME');
const password = requireEnv('DB_PASSWORD');
const database = requireEnv('DB_DATABASE');
const port = parseInt(process.env.DB_PORT || String(DEFAULT_PORTS[type]), 10);

// Build SSL config for PostgreSQL
const sslConfig =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

/**
 * TypeORM Data Source for CLI commands (migrations, etc.)
 *
 * Required environment variables:
 * - DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE
 *
 * Optional:
 * - DB_TYPE (default: postgres)
 * - DB_PORT (default: 5432 for postgres, 3306 for mysql)
 * - DB_SSL (default: false)
 */
export const AppDataSource = new DataSource({
  type: type as 'postgres' | 'mysql',
  host,
  port,
  username,
  password,
  database,
  ssl: sslConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
} as DataSourceOptions);

// Log configuration for debugging (without sensitive data)
console.log(`📦 Database: ${type}://${host}:${port}/${database}`);
