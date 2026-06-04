import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkLocationsToBusiness1780239818842 implements MigrationInterface {
  name = 'LinkLocationsToBusiness1780239818842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "business"
        ADD COLUMN IF NOT EXISTS "default_address_location_id" integer
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "business"
          ADD CONSTRAINT "FK_business_default_address_location"
          FOREIGN KEY ("default_address_location_id") REFERENCES "locations"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "business" DROP CONSTRAINT IF EXISTS "FK_business_default_address_location"
    `);
    await queryRunner.query(`
      ALTER TABLE "business" DROP COLUMN IF EXISTS "default_address_location_id"
    `);
  }
}
