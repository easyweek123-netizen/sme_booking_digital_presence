import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookingsIndexes1778600400000 implements MigrationInterface {
  name = 'UpdateBookingsIndexes1778600400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner
        .query(`ALTER TABLE bookings DROP INDEX UQ_booking_slot`)
        .catch(() => undefined);
      await queryRunner.query(
        `CREATE INDEX idx_booking_slot ON bookings (serviceId, date, startTime)`,
      );
      await queryRunner.query(
        `ALTER TABLE bookings ADD COLUMN notes TEXT NULL`,
      );
    } else {
      await queryRunner.query(`DROP INDEX IF EXISTS "UQ_booking_slot"`);
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "idx_booking_slot" ON "bookings" ("serviceId", "date", "startTime") WHERE "status" != 'CANCELLED'`,
      );
      await queryRunner.query(
        `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "notes" TEXT NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(`ALTER TABLE bookings DROP COLUMN notes`);
      await queryRunner.query(`DROP INDEX idx_booking_slot ON bookings`);
      await queryRunner.query(
        `CREATE UNIQUE INDEX UQ_booking_slot ON bookings (businessId, date, startTime)`,
      );
    } else {
      await queryRunner.query(
        `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "notes"`,
      );
      await queryRunner.query(`DROP INDEX IF EXISTS "idx_booking_slot"`);
      await queryRunner.query(
        `CREATE UNIQUE INDEX "UQ_booking_slot" ON "bookings" ("businessId", "date", "startTime") WHERE "status" != 'CANCELLED'`,
      );
    }
  }
}
