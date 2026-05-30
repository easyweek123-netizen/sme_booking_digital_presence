import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ override: true });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const host = requireEnv('DB_HOST');
const username = requireEnv('DB_USERNAME');
const password = requireEnv('DB_PASSWORD');
const database = requireEnv('DB_DATABASE');
const port = parseInt(process.env.DB_PORT || '5432', 10);
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

/**
 * TypeORM Data Source for CLI commands (migrations).
 * Globs use __dirname so they resolve correctly under both:
 *   - ts-node (local dev): resolves to src/**
 *   - compiled dist (production Railway deploy): resolves to dist/**
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  ssl,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});

console.log(`📦 Database: postgres://${host}:${port}/${database}`);
