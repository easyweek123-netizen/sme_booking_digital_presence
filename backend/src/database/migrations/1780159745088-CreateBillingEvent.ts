import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingEvent1780159745088 implements MigrationInterface {
  name = 'CreateBillingEvent1780159745088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "billing_event" (
        "id"            SERIAL NOT NULL,
        "ownerId"       integer NOT NULL,
        "businessId"    integer NOT NULL,
        "eventType"     character varying(40) NOT NULL,
        "targetPlan"    "public"."plan_enum",
        "sourceFeature" character varying(60),
        "metadata"      jsonb NOT NULL,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ac1dfafaa66e50aa628796da697" PRIMARY KEY ("id"),
        CONSTRAINT "FK_7eec3f99885fd52a94230b9598b"
          FOREIGN KEY ("ownerId") REFERENCES "owners"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_89e4a53a9e5bd34ec298d24646d"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_billing_event_type" ON "billing_event" ("eventType")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_billing_event_owner_createdAt"
        ON "billing_event" ("ownerId", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_billing_event_owner_createdAt"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_billing_event_type"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "billing_event"`);
  }
}
