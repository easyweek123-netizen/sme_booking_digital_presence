import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocations1780238816033 implements MigrationInterface {
  name = 'CreateLocations1780238816033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "locations" (
        "id"           SERIAL NOT NULL,
        "businessId"   integer NOT NULL,
        "type"         character varying(16) NOT NULL,
        "label"        character varying(80),
        "verifiedAt"   timestamptz,
        "line1"        character varying(255),
        "city"         character varying(100),
        "postalCode"   character varying(16),
        "country_code" character varying(2),
        "latitude"     numeric(9,6),
        "longitude"    numeric(9,6),
        "placeId"      character varying(80),
        "phone_number" character varying(20),
        "calendar_id"  integer,
        "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_locations" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_location_type_fields" CHECK (
          (type = 'ADDRESS' AND line1 IS NOT NULL AND city IS NOT NULL
                            AND country_code IS NOT NULL AND latitude IS NOT NULL AND longitude IS NOT NULL) OR
          (type = 'PHONE'   AND phone_number IS NOT NULL) OR
          (type = 'ONLINE'  AND calendar_id IS NOT NULL)
        )
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_locations_business"
        ON "locations" ("businessId")
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "locations"
          ADD CONSTRAINT "FK_locations_business"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "locations"
          ADD CONSTRAINT "FK_locations_calendar"
          FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_locations_business"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "locations"`);
  }
}
