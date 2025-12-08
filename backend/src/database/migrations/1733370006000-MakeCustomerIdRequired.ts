import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerIdRequired1733370006000 implements MigrationInterface {
  name = 'MakeCustomerIdRequired1733370006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete any bookings without a customer (shouldn't exist in prod, but for safety)
    await queryRunner.query(`DELETE FROM "bookings" WHERE "customerId" IS NULL`);

    // Make customerId NOT NULL
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "customerId" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Make customerId nullable again
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "customerId" DROP NOT NULL`);
  }
}

