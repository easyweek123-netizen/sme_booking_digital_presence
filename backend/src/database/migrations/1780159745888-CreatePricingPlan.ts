import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePricingPlan1780159745888 implements MigrationInterface {
  name = 'CreatePricingPlan1780159745888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pricing_plan" (
        "id"            SERIAL NOT NULL,
        "plan"          "public"."plan_enum" NOT NULL,
        "cycle"         "public"."billing_cycle" NOT NULL,
        "amountCents"   integer NOT NULL,
        "currency"      character varying(3) NOT NULL DEFAULT 'EUR',
        "stripePriceId" character varying(120),
        "features"      jsonb NOT NULL,
        "active"        boolean NOT NULL DEFAULT true,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_6c58c7053b6a1404176154fe47f" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "pricing_plan"`);
  }
}
