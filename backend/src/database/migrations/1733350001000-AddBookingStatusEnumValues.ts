import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration 1: Add new enum values to booking status
 * 
 * IMPORTANT: Uses `transaction = false` because PostgreSQL requires
 * enum value additions to be committed before they can be used.
 * This is the official TypeORM solution for PostgreSQL enum changes.
 */
export class AddBookingStatusEnumValues1733350001000 implements MigrationInterface {
  name = 'AddBookingStatusEnumValues1733350001000';

  // Disable transaction - PostgreSQL enum changes must commit immediately
  transaction = false as const;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL: Add new enum values (commits immediately due to transaction = false)
    await queryRunner.query(`ALTER TYPE "public"."bookings_status_enum" ADD VALUE IF NOT EXISTS 'PENDING'`);
    await queryRunner.query(`ALTER TYPE "public"."bookings_status_enum" ADD VALUE IF NOT EXISTS 'NO_SHOW'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL doesn't support removing enum values
    // Would need to recreate the type, which is complex
    console.warn('Cannot remove enum values in PostgreSQL. Manual intervention required.');
  }
}

