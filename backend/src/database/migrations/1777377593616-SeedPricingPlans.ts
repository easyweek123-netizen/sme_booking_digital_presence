import { MigrationInterface, QueryRunner } from 'typeorm';

const PRO_FEATURES = [
  'Unlimited services',
  'Unlimited bookings',
  'Persistent multi-thread chat',
  'Analytics',
  '24h reminders',
  'Calendar sync',
  'Custom domain',
  'Remove BookEasy branding',
];

const GROWTH_FEATURES = [
  'Everything in Pro',
  'Staff management',
  'WhatsApp/IG/Messenger AI receptionist',
  'Unified inbox',
  'Auto-booking + smart escalation',
];

export class SeedPricingPlans1777377593616 implements MigrationInterface {
  name = 'SeedPricingPlans1777377593616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      await queryRunner.query(
        `INSERT IGNORE INTO \`pricing_plan\` (\`plan\`, \`cycle\`, \`amountCents\`, \`currency\`, \`stripePriceId\`, \`features\`, \`active\`)
         VALUES
          ('pro','monthly',1900,'EUR',NULL,'${JSON.stringify(PRO_FEATURES)}',true),
          ('pro','annual',22800,'EUR',NULL,'${JSON.stringify(PRO_FEATURES)}',true),
          ('growth','monthly',4900,'EUR',NULL,'${JSON.stringify(GROWTH_FEATURES)}',true),
          ('growth','annual',58800,'EUR',NULL,'${JSON.stringify(GROWTH_FEATURES)}',true)`,
      );
      return;
    }

    // Postgres (default)
    await queryRunner.query(
      `INSERT INTO "pricing_plan" ("plan", "cycle", "amountCents", "currency", "stripePriceId", "features", "active")
       VALUES
        ('pro','monthly',1900,'EUR',NULL,'${JSON.stringify(PRO_FEATURES)}'::jsonb,true),
        ('pro','annual',22800,'EUR',NULL,'${JSON.stringify(PRO_FEATURES)}'::jsonb,true),
        ('growth','monthly',4900,'EUR',NULL,'${JSON.stringify(GROWTH_FEATURES)}'::jsonb,true),
        ('growth','annual',58800,'EUR',NULL,'${JSON.stringify(GROWTH_FEATURES)}'::jsonb,true)
       ON CONFLICT ("plan", "cycle") WHERE "active" = true DO NOTHING`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      await queryRunner.query(
        `DELETE FROM \`pricing_plan\` WHERE \`plan\` IN ('pro','growth')`,
      );
      return;
    }

    await queryRunner.query(
      `DELETE FROM "pricing_plan" WHERE "plan" IN ('pro','growth')`,
    );
  }
}
