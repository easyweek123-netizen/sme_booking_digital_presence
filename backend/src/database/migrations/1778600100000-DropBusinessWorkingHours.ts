import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropBusinessWorkingHours1778600100000 implements MigrationInterface {
  name = 'DropBusinessWorkingHours1778600100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const table = isMysql ? 'business' : '"business"';
    const col = isMysql ? 'working_hours' : '"working_hours"';
    await queryRunner.query(
      `ALTER TABLE ${table} DROP COLUMN IF EXISTS ${col}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE business ADD COLUMN working_hours JSON NULL`,
      );
    } else {
      await queryRunner.query(
        `ALTER TABLE "business" ADD COLUMN "working_hours" JSON NULL`,
      );
    }
  }
}
