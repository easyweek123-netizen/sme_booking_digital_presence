import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Drops two single-column indexes made redundant by their unique composite counterparts.
 *
 * IDX_calendar_business [businessId]
 *   → redundant with UQ_calendar_business_provider (businessId, provider)
 *     Postgres uses the composite for businessId-only lookups (leading column).
 *
 * IDX_calendar_event_calendar [calendarId]
 *   → redundant with UQ_calendar_event_calendar_booking (calendarId, bookingId)
 *     Same reasoning — calendarId is the leading column.
 *
 * These indexes were never created by the new migrations (they were intentionally
 * omitted). The DROP IF EXISTS here cleans them up on the existing Railway DB
 * that was built by synchronize:true.
 */
export class DropRedundantCalendarIndexes1780163242370 implements MigrationInterface {
  name = 'DropRedundantCalendarIndexes1780163242370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_calendar_business"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_calendar_event_calendar"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_calendar_business" ON "calendar" ("businessId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_calendar_event_calendar" ON "calendar_event" ("calendarId")
    `);
  }
}
