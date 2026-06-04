import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkLocationsToService1780239819587 implements MigrationInterface {
  name = 'LinkLocationsToService1780239819587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "services"
        ADD COLUMN IF NOT EXISTS "location_id" integer
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "services"
          ADD CONSTRAINT "FK_services_location"
          FOREIGN KEY ("location_id") REFERENCES "locations"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "FK_services_location"
    `);
    await queryRunner.query(`
      ALTER TABLE "services" DROP COLUMN IF EXISTS "location_id"
    `);
  }
}
