import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBillingFoundation1777377593615 implements MigrationInterface {
  name = 'AddBillingFoundation1777377593615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    // MySQL: wrap whole migration in one hasTable check (per milestone doc).
    if (dbType === 'mysql') {
      const alreadyApplied = await queryRunner.hasTable('subscription');
      if (alreadyApplied) return;

      await queryRunner.query(
        `ALTER TABLE \`business\`
          ADD COLUMN \`plan\` ENUM('free','pro','growth') NOT NULL DEFAULT 'free',
          ADD COLUMN \`providerCustomerId\` varchar(120) NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE \`business\` ADD CONSTRAINT \`UQ_business_providerCustomerId\` UNIQUE (\`providerCustomerId\`)`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_business_plan\` ON \`business\` (\`plan\`)`,
      );

      await queryRunner.query(
        `CREATE TABLE \`subscription\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`businessId\` int NOT NULL,
          \`provider\` ENUM('mock','stripe') NOT NULL,
          \`providerSubId\` varchar(120) NOT NULL,
          \`plan\` ENUM('free','pro','growth') NOT NULL,
          \`cycle\` ENUM('monthly','annual') NOT NULL,
          \`status\` ENUM('active','past_due','canceled','incomplete','trialing') NOT NULL,
          \`currentPeriodStart\` TIMESTAMP NOT NULL,
          \`currentPeriodEnd\` TIMESTAMP NOT NULL,
          \`cancelAtPeriodEnd\` boolean NOT NULL DEFAULT false,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (\`businessId\`),
          UNIQUE (\`providerSubId\`),
          CONSTRAINT \`FK_subscription_businessId\` FOREIGN KEY (\`businessId\`) REFERENCES \`business\`(\`id\`) ON DELETE CASCADE,
          PRIMARY KEY (\`id\`)
        )`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_subscription_status\` ON \`subscription\` (\`status\`)`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_subscription_periodEnd\` ON \`subscription\` (\`currentPeriodEnd\`)`,
      );

      await queryRunner.query(
        `CREATE TABLE \`invoice\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`subscriptionId\` int NOT NULL,
          \`providerInvoiceId\` varchar(120) NOT NULL,
          \`amountCents\` int NOT NULL,
          \`currency\` varchar(3) NOT NULL,
          \`status\` ENUM('draft','open','paid','uncollectible','void') NOT NULL,
          \`periodStart\` TIMESTAMP NOT NULL,
          \`periodEnd\` TIMESTAMP NOT NULL,
          \`paidAt\` TIMESTAMP NULL,
          \`hostedUrl\` varchar(500) NULL,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (\`providerInvoiceId\`),
          CONSTRAINT \`FK_invoice_subscriptionId\` FOREIGN KEY (\`subscriptionId\`) REFERENCES \`subscription\`(\`id\`) ON DELETE CASCADE,
          PRIMARY KEY (\`id\`)
        )`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_invoice_subscription_createdAt\` ON \`invoice\` (\`subscriptionId\`, \`createdAt\`)`,
      );

      await queryRunner.query(
        `CREATE TABLE \`billing_event\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`ownerId\` int NOT NULL,
          \`businessId\` int NOT NULL,
          \`eventType\` varchar(40) NOT NULL,
          \`targetPlan\` ENUM('free','pro','growth') NULL,
          \`sourceFeature\` varchar(60) NULL,
          \`metadata\` JSON NOT NULL,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`FK_billing_event_ownerId\` FOREIGN KEY (\`ownerId\`) REFERENCES \`owners\`(\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`FK_billing_event_businessId\` FOREIGN KEY (\`businessId\`) REFERENCES \`business\`(\`id\`) ON DELETE CASCADE,
          PRIMARY KEY (\`id\`)
        )`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_billing_event_owner_createdAt\` ON \`billing_event\` (\`ownerId\`, \`createdAt\`)`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_billing_event_type\` ON \`billing_event\` (\`eventType\`)`,
      );

      await queryRunner.query(
        `CREATE TABLE \`pricing_plan\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`plan\` ENUM('free','pro','growth') NOT NULL,
          \`cycle\` ENUM('monthly','annual') NOT NULL,
          \`amountCents\` int NOT NULL,
          \`currency\` varchar(3) NOT NULL DEFAULT 'EUR',
          \`stripePriceId\` varchar(120) NULL,
          \`features\` JSON NOT NULL,
          \`active\` boolean NOT NULL DEFAULT true,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`CHK_pricing_plan_amountCents\` CHECK (\`amountCents\` >= 0),
          CONSTRAINT \`UQ_pricing_plan_active\` UNIQUE (\`plan\`, \`cycle\`, \`active\`),
          PRIMARY KEY (\`id\`)
        )`,
      );

      return;
    }

    // Postgres (default)
    // Enums
    try {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "plan_enum" AS ENUM ('free','pro','growth');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;`,
      );
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "billing_cycle" AS ENUM ('monthly','annual');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;`,
      );
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "sub_status" AS ENUM ('active','past_due','canceled','incomplete','trialing');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;`,
      );
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "billing_provider_id" AS ENUM ('mock','stripe');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;`,
      );
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "invoice_status" AS ENUM ('draft','open','paid','uncollectible','void');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;`,
      );
    } catch {
      // ignore
    }

    // Business: add plan cache + durable customer id (idempotent)
    const businessTable = await queryRunner.getTable('business');
    const hasBusinessPlan = businessTable?.findColumnByName('plan');
    const hasProviderCustomerId =
      businessTable?.findColumnByName('providerCustomerId');
    const hasProviderCustomerIdUnique = businessTable?.uniques.some(
      (unique) => unique.name === 'UQ_business_providerCustomerId',
    );

    if (!hasBusinessPlan) {
      await queryRunner.query(
        `ALTER TABLE "business" ADD COLUMN "plan" "plan_enum" NOT NULL DEFAULT 'free';`,
      );
    }

    if (!hasProviderCustomerId) {
      await queryRunner.query(
        `ALTER TABLE "business" ADD COLUMN "providerCustomerId" varchar(120) NULL;`,
      );
    }

    if (!hasProviderCustomerIdUnique) {
      await queryRunner.query(
        `ALTER TABLE "business" ADD CONSTRAINT "UQ_business_providerCustomerId" UNIQUE ("providerCustomerId");`,
      );
    }

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_business_plan" ON "business" ("plan");`,
    );

    // Subscription
    const subscriptionExists = await queryRunner.hasTable('subscription');
    if (!subscriptionExists) {
      await queryRunner.query(
        `CREATE TABLE "subscription" (
          "id"                  SERIAL PRIMARY KEY,
          "businessId"          int NOT NULL UNIQUE REFERENCES "business"("id") ON DELETE CASCADE,
          "provider"            "billing_provider_id" NOT NULL,
          "providerSubId"       varchar(120) NOT NULL UNIQUE,
          "plan"                "plan_enum" NOT NULL,
          "cycle"               "billing_cycle" NOT NULL,
          "status"              "sub_status" NOT NULL,
          "currentPeriodStart"  TIMESTAMP NOT NULL,
          "currentPeriodEnd"    TIMESTAMP NOT NULL,
          "cancelAtPeriodEnd"   boolean NOT NULL DEFAULT false,
          "createdAt"           TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt"           TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_subscription_status" ON "subscription" ("status");`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_subscription_periodEnd" ON "subscription" ("currentPeriodEnd");`,
      );
    }

    // Invoice
    const invoiceExists = await queryRunner.hasTable('invoice');
    if (!invoiceExists) {
      await queryRunner.query(
        `CREATE TABLE "invoice" (
          "id"                 SERIAL PRIMARY KEY,
          "subscriptionId"     int NOT NULL REFERENCES "subscription"("id") ON DELETE CASCADE,
          "providerInvoiceId"  varchar(120) NOT NULL UNIQUE,
          "amountCents"        int NOT NULL,
          "currency"           varchar(3) NOT NULL,
          "status"             "invoice_status" NOT NULL,
          "periodStart"        TIMESTAMP NOT NULL,
          "periodEnd"          TIMESTAMP NOT NULL,
          "paidAt"             TIMESTAMP NULL,
          "hostedUrl"          varchar(500) NULL,
          "createdAt"          TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_invoice_subscription_createdAt" ON "invoice" ("subscriptionId", "createdAt" DESC);`,
      );
    }

    // Billing event
    const billingEventExists = await queryRunner.hasTable('billing_event');
    if (!billingEventExists) {
      await queryRunner.query(
        `CREATE TABLE "billing_event" (
          "id"             SERIAL PRIMARY KEY,
          "ownerId"        int NOT NULL REFERENCES "owners"("id") ON DELETE CASCADE,
          "businessId"     int NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
          "eventType"      varchar(40) NOT NULL,
          "targetPlan"     "plan_enum" NULL,
          "sourceFeature"  varchar(60) NULL,
          "metadata"       jsonb NOT NULL DEFAULT '{}',
          "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_billing_event_owner_createdAt" ON "billing_event" ("ownerId", "createdAt" DESC);`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_billing_event_type" ON "billing_event" ("eventType");`,
      );
    }

    // Pricing plan
    const pricingPlanExists = await queryRunner.hasTable('pricing_plan');
    if (!pricingPlanExists) {
      await queryRunner.query(
        `CREATE TABLE "pricing_plan" (
          "id"             SERIAL PRIMARY KEY,
          "plan"           "plan_enum" NOT NULL,
          "cycle"          "billing_cycle" NOT NULL,
          "amountCents"    int NOT NULL CHECK ("amountCents" >= 0),
          "currency"       varchar(3) NOT NULL DEFAULT 'EUR',
          "stripePriceId"  varchar(120) NULL,
          "features"       jsonb NOT NULL DEFAULT '[]',
          "active"         boolean NOT NULL DEFAULT true,
          "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt"      TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE UNIQUE INDEX "UQ_pricing_plan_active" ON "pricing_plan" ("plan", "cycle") WHERE "active" = true;`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      const pricingPlanExists = await queryRunner.hasTable('pricing_plan');
      if (pricingPlanExists) await queryRunner.dropTable('pricing_plan');

      const billingEventExists = await queryRunner.hasTable('billing_event');
      if (billingEventExists) await queryRunner.dropTable('billing_event');

      const invoiceExists = await queryRunner.hasTable('invoice');
      if (invoiceExists) await queryRunner.dropTable('invoice');

      const subscriptionExists = await queryRunner.hasTable('subscription');
      if (subscriptionExists) await queryRunner.dropTable('subscription');

      try {
        await queryRunner.query(
          `DROP INDEX \`IDX_business_plan\` ON \`business\``,
        );
      } catch {
        // ignore
      }
      try {
        await queryRunner.query(
          `ALTER TABLE \`business\` DROP INDEX \`UQ_business_providerCustomerId\``,
        );
      } catch {
        // ignore
      }
      await queryRunner.query(
        `ALTER TABLE \`business\` DROP COLUMN \`providerCustomerId\`, DROP COLUMN \`plan\``,
      );

      return;
    }

    // Postgres: reverse order — drop tables, then business columns, then types.
    const pricingPlanExists = await queryRunner.hasTable('pricing_plan');
    if (pricingPlanExists) await queryRunner.dropTable('pricing_plan');

    const billingEventExists = await queryRunner.hasTable('billing_event');
    if (billingEventExists) await queryRunner.dropTable('billing_event');

    const invoiceExists = await queryRunner.hasTable('invoice');
    if (invoiceExists) await queryRunner.dropTable('invoice');

    const subscriptionExists = await queryRunner.hasTable('subscription');
    if (subscriptionExists) await queryRunner.dropTable('subscription');

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_business_plan";`);
    await queryRunner.query(
      `ALTER TABLE "business"
        DROP CONSTRAINT IF EXISTS "UQ_business_providerCustomerId",
        DROP COLUMN IF EXISTS "providerCustomerId",
        DROP COLUMN IF EXISTS "plan";`,
    );

    try {
      await queryRunner.query(`DROP TYPE IF EXISTS "invoice_status";`);
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(`DROP TYPE IF EXISTS "billing_provider_id";`);
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(`DROP TYPE IF EXISTS "sub_status";`);
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(`DROP TYPE IF EXISTS "billing_cycle";`);
    } catch {
      // ignore
    }
    try {
      await queryRunner.query(`DROP TYPE IF EXISTS "plan_enum";`);
    } catch {
      // ignore
    }
  }
}
