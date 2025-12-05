import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration 2: Add reference column to bookings table
 */
export class AddBookingReference1733350002000 implements MigrationInterface {
  name = 'AddBookingReference1733350002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add reference column (nullable first)
    await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "reference" VARCHAR(10)`);
    
    // Generate references for existing bookings
    await queryRunner.query(`
      UPDATE "bookings" 
      SET "reference" = CONCAT('BK-', UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)))
      WHERE "reference" IS NULL
    `);
    
    // Make reference NOT NULL
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "reference" SET NOT NULL`);
    
    // Add unique constraint
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "UQ_bookings_reference" UNIQUE ("reference")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "UQ_bookings_reference"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "reference"`);
  }
}

