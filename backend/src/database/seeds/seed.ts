import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { BusinessCategory } from '../../business-categories/entities/business-category.entity';
import { BusinessType } from '../../business-categories/entities/business-type.entity';
import { PricingPlan } from '../../billing/entities/pricing-plan.entity';
import { BillingCycle, Plan } from '../../billing/types/enums';

// Load environment variables
config({ override: true });

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
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
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
      { slug: 'nail-salon', name: 'Nail Salon' },
      { slug: 'hair-salon', name: 'Hair Salon' },
    ],
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    icon: '🧘',
    color: '#22C55E',
    types: [
      { slug: 'yoga-studio', name: 'Yoga Studio' },
      { slug: 'spiritual-wellness', name: 'Spiritual Wellness' },
      { slug: 'fitness-studio', name: 'Fitness Studio' },
    ],
  },
  {
    slug: 'coaching',
    name: 'Coaching',
    icon: '🎓',
    color: '#000000',
    types: [
      { slug: 'science-coaching', name: 'Science Coaching' },
      { slug: 'language-coaching', name: 'Language Coaching' },
      { slug: 'music-coaching', name: 'Music Coaching' },
    ],
  },
];

const PRO_FEATURES = [
  'Unlimited services',
  'Unlimited bookings',
  'Online bookings',
  'Persistent multi-thread chat',
  '24h reminders',
  'Calendar sync',
  'Remove BookEasy branding',
];

const pricingData: Partial<PricingPlan>[] = [
  {
    plan: Plan.PRO,
    cycle: BillingCycle.MONTHLY,
    amountCents: 1900,
    currency: 'EUR',
    features: PRO_FEATURES,
    active: true,
  },
  {
    plan: Plan.PRO,
    cycle: BillingCycle.ANNUAL,
    amountCents: 22800,
    currency: 'EUR',
    features: PRO_FEATURES,
    active: true,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    const categoryRepo = dataSource.getRepository(BusinessCategory);
    const typeRepo = dataSource.getRepository(BusinessType);
    const existingCategories = await categoryRepo.find();
    const existingTypes = await typeRepo.find();
    const categoriesBySlug = new Map(
      existingCategories.map((category) => [category.slug, category]),
    );
    const typesBySlug = new Map(existingTypes.map((type) => [type.slug, type]));
    let createdCategories = 0;
    let updatedCategories = 0;
    let createdTypes = 0;
    let updatedTypes = 0;

    // Seed categories by stable slug to preserve existing foreign key references.
    for (const categoryData of categoriesData) {
      const existingCategory = categoriesBySlug.get(categoryData.slug);
      const category = existingCategory
        ? categoryRepo.merge(existingCategory, {
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
            isActive: true,
          })
        : categoryRepo.create({
            slug: categoryData.slug,
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
            isActive: true,
          });

      await categoryRepo.save(category);

      if (existingCategory) {
        updatedCategories += 1;
        console.log(`📁 Updated category: ${category.name}`);
      } else {
        createdCategories += 1;
        console.log(`📁 Created category: ${category.name}`);
      }

      // Seed types by stable slug so existing businesses keep their type IDs.
      for (const typeData of categoryData.types) {
        const existingType = typesBySlug.get(typeData.slug);
        const businessType = existingType
          ? typeRepo.merge(existingType, {
              categoryId: category.id,
              name: typeData.name,
              isActive: true,
            })
          : typeRepo.create({
              categoryId: category.id,
              slug: typeData.slug,
              name: typeData.name,
              isActive: true,
            });

        await typeRepo.save(businessType);
        if (existingType) {
          updatedTypes += 1;
          console.log(`   ├── Updated type: ${businessType.name}`);
        } else {
          createdTypes += 1;
          console.log(`   └── Created type: ${businessType.name}`);
        }
      }
    }

    console.log(
      `🧩 Synced categories and types (${createdCategories} created / ${updatedCategories} updated categories, ${createdTypes} created / ${updatedTypes} updated types)\n`,
    );

    // Seed pricing plans
    const pricingRepo = dataSource.getRepository(PricingPlan);
    await pricingRepo.createQueryBuilder().delete().from(PricingPlan).execute();
    for (const row of pricingData) {
      await pricingRepo.save(pricingRepo.create(row));
    }
    console.log(`💶 Seeded ${pricingData.length} pricing plans`);

    console.log('\n✅ Seed completed successfully!');
    console.log(`   - ${categoriesData.length} categories`);
    console.log(
      `   - ${categoriesData.reduce((acc, c) => acc + c.types.length, 0)} business types`,
    );
    console.log(`   - ${pricingData.length} pricing plans`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
