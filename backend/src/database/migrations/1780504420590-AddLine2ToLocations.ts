import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLine2ToLocations1780504420590 implements MigrationInterface {
  name = 'AddLine2ToLocations1780504420590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "line2" character varying(100) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "locations" DROP COLUMN IF EXISTS "line2"`,
    );
  }
}
