import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Supported database types
 */
type DatabaseType = 'postgres' | 'mysql';

/**
 * Database defaults per type
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
const defaults = DATABASE_DEFAULTS[type];

// Build SSL config
const sslConfig =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

/**
 * TypeORM Data Source for CLI commands (migrations, etc.)
 *
 * Usage:
 *   PostgreSQL (default): npm run migration:run
 *   MySQL: DB_TYPE=mysql npm run migration:run
 */
export const AppDataSource = new DataSource({
  type: type as 'postgres' | 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || String(defaults.port), 10),
  username: process.env.DB_USERNAME || defaults.username,
  password: process.env.DB_PASSWORD || defaults.password,
  database: process.env.DB_DATABASE || 'bookeasy',
  ssl: sslConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
} as DataSourceOptions);

// Log configuration for debugging
console.log(`📦 Database: ${type}://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || defaults.port}/${process.env.DB_DATABASE || 'bookeasy'}`);
