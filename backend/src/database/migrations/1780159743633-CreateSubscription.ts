import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscription1780159743633 implements MigrationInterface {
  name = 'CreateSubscription1780159743633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscription" (
        "id"                  SERIAL NOT NULL,
        "businessId"          integer NOT NULL,
        "provider"            "public"."billing_provider_id" NOT NULL,
        "providerSubId"       character varying(120) NOT NULL,
        "plan"                "public"."plan_enum" NOT NULL,
        "cycle"               "public"."billing_cycle" NOT NULL,
        "status"              "public"."sub_status" NOT NULL,
        "currentPeriodStart"  TIMESTAMP NOT NULL,
        "currentPeriodEnd"    TIMESTAMP NOT NULL,
        "cancelAtPeriodEnd"   boolean NOT NULL DEFAULT false,
        "createdAt"           TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"           TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_d4e12b2c1cec5ee469945e40ab3" UNIQUE ("businessId"),
        CONSTRAINT "UQ_f0ffe1183dd15b07bacfc3ea13a" UNIQUE ("providerSubId"),
        CONSTRAINT "REL_d4e12b2c1cec5ee469945e40ab" UNIQUE ("businessId"),
        CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"),
        CONSTRAINT "FK_d4e12b2c1cec5ee469945e40ab3"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscription_periodEnd" ON "subscription" ("currentPeriodEnd")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscription_status" ON "subscription" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_subscription_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_subscription_periodEnd"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription"`);
  }
}
