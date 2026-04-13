import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingSlotUniqueIndex1734400000000 implements MigrationInterface {
  name = 'AddBookingSlotUniqueIndex1734400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Partial unique index: prevents double-booking the same slot,
    // but allows re-booking a cancelled slot.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_booking_slot"
      ON "bookings" ("businessId", "date", "startTime")
      WHERE "status" != 'CANCELLED'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_booking_slot"`);
  }
}
