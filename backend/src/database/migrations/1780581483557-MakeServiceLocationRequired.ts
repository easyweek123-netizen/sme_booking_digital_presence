import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeServiceLocationRequired1780581483557 implements MigrationInterface {
  name = 'MakeServiceLocationRequired1780581483557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'services'
            AND column_name = 'location_id'
            AND is_nullable = 'YES'
        ) THEN
          ALTER TABLE "services" ALTER COLUMN "location_id" SET NOT NULL;
        END IF;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'services'
            AND column_name = 'location_id'
            AND is_nullable = 'NO'
        ) THEN
          ALTER TABLE "services" ALTER COLUMN "location_id" DROP NOT NULL;
        END IF;
      END $$
    `);
  }
}
