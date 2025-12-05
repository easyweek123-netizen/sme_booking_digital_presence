import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration 3: Change default booking status to PENDING
 * Must run after enum values are committed (Migration 1)
 */
export class SetDefaultStatusPending1733350003000 implements MigrationInterface {
  name = 'SetDefaultStatusPending1733350003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change default status to PENDING
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to CONFIRMED as default
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED'`);
  }
}

