import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePhoneFields1733370005000 implements MigrationInterface {
  name = 'RemovePhoneFields1733370005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop customerPhone from bookings table
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "customerPhone"`);

    // Drop phone from customers table
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "phone"`);

    // Make firebaseUid NOT NULL in customers (first update any null values)
    await queryRunner.query(`DELETE FROM "customers" WHERE "firebaseUid" IS NULL`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "firebaseUid" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Make firebaseUid nullable again
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "firebaseUid" DROP NOT NULL`);

    // Add phone back to customers table
    await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN "phone" VARCHAR(20)`);

    // Add customerPhone back to bookings table
    await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "customerPhone" VARCHAR(20)`);
  }
}

