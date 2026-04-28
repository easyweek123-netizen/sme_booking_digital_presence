import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBusinessesToBusiness1735600000000 implements MigrationInterface {
  name = 'RenameBusinessesToBusiness1735600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const businessesExists = await queryRunner.hasTable('businesses');
    const businessExists = await queryRunner.hasTable('business');

    if (businessExists) {
      return;
    }

    if (businessesExists) {
      await queryRunner.renameTable('businesses', 'business');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const businessesExists = await queryRunner.hasTable('businesses');
    const businessExists = await queryRunner.hasTable('business');

    if (businessesExists) {
      return;
    }

    if (businessExists) {
      await queryRunner.renameTable('business', 'businesses');
    }
  }
}
