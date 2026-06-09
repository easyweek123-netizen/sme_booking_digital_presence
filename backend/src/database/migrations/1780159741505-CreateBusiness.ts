import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `business` table.
 * The FK for `default_schedule_id → schedule.id` is intentionally deferred to
 * FinalizeConstraints because business ↔ schedule is a circular dependency
 * (schedule.business_id → business also). The column itself is present here.
 */
export class CreateBusiness1780159741505 implements MigrationInterface {
  name = 'CreateBusiness1780159741505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "business" (
        "id"                 SERIAL NOT NULL,
        "ownerId"            integer NOT NULL,
        "businessTypeId"     integer,
        "slug"               character varying(100) NOT NULL,
        "name"               character varying(200) NOT NULL,
        "description"        text,
        "address"            character varying(255),
        "city"               character varying(100),
        "phone"              character varying(20),
        "website"            character varying(255),
        "instagram"          character varying(100),
        "logoUrl"            character varying(500),
        "brandColor"         character varying(7),
        "coverImageUrl"      character varying(500),
        "timezone"           character varying(64) NOT NULL DEFAULT 'Europe/Vienna',
        "aboutContent"       text,
        "plan"               "public"."plan_enum" NOT NULL DEFAULT 'free',
        "providerCustomerId" character varying(120),
        "default_schedule_id" integer,
        "createdAt"          TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"          TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_84a9cab71052a72adadf392d14e" UNIQUE ("slug"),
        CONSTRAINT "UQ_f71fb4b1e0df2b47b5887808773" UNIQUE ("providerCustomerId"),
        CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"),
        CONSTRAINT "FK_91230ea862c52e2aa78208c7bb8"
          FOREIGN KEY ("ownerId") REFERENCES "owners"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_d2ebc0288329a1485a2afdb10c5"
          FOREIGN KEY ("businessTypeId") REFERENCES "business_types"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_business_plan" ON "business" ("plan")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_business_plan"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "business"`);
  }
}
