import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBusinessDefaultLocation1780520597898 implements MigrationInterface {
  name = 'RenameBusinessDefaultLocation1780520597898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'business' AND column_name = 'default_address_location_id'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'business' AND column_name = 'default_location_id'
        ) THEN
          ALTER TABLE "business"
            RENAME COLUMN "default_address_location_id" TO "default_location_id";
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_business_default_address_location'
        ) THEN
          ALTER TABLE "business"
            RENAME CONSTRAINT "FK_business_default_address_location" TO "FK_business_default_location";
        END IF;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_business_default_location'
        ) THEN
          ALTER TABLE "business"
            RENAME CONSTRAINT "FK_business_default_location" TO "FK_business_default_address_location";
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'business' AND column_name = 'default_location_id'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'business' AND column_name = 'default_address_location_id'
        ) THEN
          ALTER TABLE "business"
            RENAME COLUMN "default_location_id" TO "default_address_location_id";
        END IF;
      END $$
    `);
  }
}
