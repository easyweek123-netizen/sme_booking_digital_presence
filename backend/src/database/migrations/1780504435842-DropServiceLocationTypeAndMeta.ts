import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropServiceLocationTypeAndMeta1780504435842 implements MigrationInterface {
  name = 'DropServiceLocationTypeAndMeta1780504435842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "services"
        DROP COLUMN IF EXISTS "location_type",
        DROP COLUMN IF EXISTS "location_meta"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "services"
        ADD COLUMN IF NOT EXISTS "location_type" character varying(16) NOT NULL DEFAULT 'AT_BUSINESS',
        ADD COLUMN IF NOT EXISTS "location_meta" jsonb
    `);
  }
}
