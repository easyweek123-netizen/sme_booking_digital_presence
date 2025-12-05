import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrandColor1733360000000 implements MigrationInterface {
  name = 'AddBrandColor1733360000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "brandColor" VARCHAR(7)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businesses" DROP COLUMN IF EXISTS "brandColor"`,
    );
  }
}

