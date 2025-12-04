import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { BusinessCategory } from '../../business-categories/entities/business-category.entity';
import { BusinessType } from '../../business-categories/entities/business-type.entity';
import { Business } from '../../business/entities/business.entity';
import { Owner } from '../../owner/entities/owner.entity';
import { Service } from '../../services/entities/service.entity';
import { Booking } from '../../bookings/entities/booking.entity';

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
 * Get and validate database type
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

// Get configuration from environment
const type = getDatabaseType();
const host = requireEnv('DB_HOST');
const username = requireEnv('DB_USERNAME');
const password = requireEnv('DB_PASSWORD');
const database = requireEnv('DB_DATABASE');
const port = parseInt(process.env.DB_PORT || String(DEFAULT_PORTS[type]), 10);

// Build SSL config
const sslConfig =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

const dataSource = new DataSource({
  type: type as 'postgres' | 'mysql',
  host,
  port,
  username,
  password,
  database,
  ssl: sslConfig,
  entities: [BusinessCategory, BusinessType, Business, Owner, Service, Booking],
  synchronize: true,
  logging: true,
} as DataSourceOptions);

console.log(`📦 Database: ${type}://${host}:${port}/${database}`);

interface CategorySeed {
  slug: string;
  name: string;
  icon: string;
  color: string;
  types: { slug: string; name: string }[];
}

const categoriesData: CategorySeed[] = [
  {
    slug: 'beauty',
    name: 'Beauty',
    icon: '✂️',
    color: '#EC4899',
    types: [
      { slug: 'beauty-salon', name: 'Beauty Salon' },
      { slug: 'barbershop', name: 'Barbershop' },
      { slug: 'nail-salon', name: 'Nail Salon' },
      { slug: 'hair-salon', name: 'Hair Salon' },
    ],
  },
  {
    slug: 'health',
    name: 'Health',
    icon: '💪',
    color: '#14B8A6',
    types: [
      { slug: 'massage-therapist', name: 'Massage Therapist' },
      { slug: 'physiotherapy', name: 'Physiotherapy' },
      { slug: 'chiropractor', name: 'Chiropractor' },
    ],
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    icon: '🧘',
    color: '#22C55E',
    types: [
      { slug: 'yoga-studio', name: 'Yoga Studio' },
      { slug: 'meditation-center', name: 'Meditation Center' },
      { slug: 'life-coach', name: 'Life Coach' },
    ],
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    const categoryRepo = dataSource.getRepository(BusinessCategory);
    const typeRepo = dataSource.getRepository(BusinessType);

    // Clear existing data (in reverse order due to foreign keys)
    await typeRepo.createQueryBuilder().delete().from(BusinessType).execute();
    await categoryRepo
      .createQueryBuilder()
      .delete()
      .from(BusinessCategory)
      .execute();
    console.log('🧹 Cleared existing categories and types\n');

    // Seed categories and types
    for (const categoryData of categoriesData) {
      // Create category
      const category = categoryRepo.create({
        slug: categoryData.slug,
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
        isActive: true,
      });
      await categoryRepo.save(category);
      console.log(`📁 Created category: ${category.name}`);

      // Create types for this category
      for (const typeData of categoryData.types) {
        const businessType = typeRepo.create({
          categoryId: category.id,
          slug: typeData.slug,
          name: typeData.name,
          isActive: true,
        });
        await typeRepo.save(businessType);
        console.log(`   └── ${businessType.name}`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(`   - ${categoriesData.length} categories`);
    console.log(
      `   - ${categoriesData.reduce((acc, c) => acc + c.types.length, 0)} business types`,
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
