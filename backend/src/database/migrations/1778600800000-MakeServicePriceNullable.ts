import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeServicePriceNullable1778600800000 implements MigrationInterface {
  name = 'MakeServicePriceNullable1778600800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') return;

    const rows: Array<{ is_nullable: string }> = await queryRunner.query(
      `SELECT is_nullable FROM information_schema.columns
       WHERE table_name = 'services' AND column_name = 'price'`,
    );
    if (rows.length === 0) return;
    if (rows[0].is_nullable === 'YES') return;

    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "price" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') return;

    const rows: Array<{ is_nullable: string }> = await queryRunner.query(
      `SELECT is_nullable FROM information_schema.columns
       WHERE table_name = 'services' AND column_name = 'price'`,
    );
    if (rows.length === 0) return;
    if (rows[0].is_nullable === 'NO') return;

    await queryRunner.query(
      `UPDATE "services" SET "price" = 0 WHERE "price" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "price" SET NOT NULL`,
    );
  }
}
