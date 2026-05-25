import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropBookingsSlotIndex1778600600000 implements MigrationInterface {
  name = 'DropBookingsSlotIndex1778600600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner
        .query(`ALTER TABLE bookings DROP INDEX idx_booking_slot`)
        .catch(() => undefined);
    } else {
      await queryRunner.query(`DROP INDEX IF EXISTS "idx_booking_slot"`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `CREATE INDEX idx_booking_slot ON bookings (serviceId, date, startTime)`,
      );
    } else {
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "idx_booking_slot" ON "bookings" ("serviceId", "date", "startTime") WHERE "status" != 'CANCELLED'`,
      );
    }
  }
}
