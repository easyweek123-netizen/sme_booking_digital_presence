import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropBusinessDefaultLocation1780965260068 implements MigrationInterface {
  name = 'DropBusinessDefaultLocation1780965260068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_business_default_location') THEN
          ALTER TABLE "business" DROP CONSTRAINT "FK_business_default_location";
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "default_location_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" ADD COLUMN IF NOT EXISTS "default_location_id" integer`,
    );
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "business"
          ADD CONSTRAINT "FK_business_default_location"
          FOREIGN KEY ("default_location_id") REFERENCES "locations"("id")
          ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
  }
}
