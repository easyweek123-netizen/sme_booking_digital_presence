import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * IDX_calendar_event_calendar (single-column on calendarId) is intentionally omitted —
 * it is redundant with UQ_calendar_event_calendar_booking which leads on calendarId.
 * FinalizeConstraints drops it from the existing Railway DB.
 * IDX_calendar_event_booking (bookingId) is kept — bookingId is not the leading
 * column of the unique composite, so this index adds real lookup value.
 */
export class CreateCalendarEvent1780159751139 implements MigrationInterface {
  name = 'CreateCalendarEvent1780159751139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "calendar_event" (
        "id"              SERIAL NOT NULL,
        "bookingId"       integer NOT NULL,
        "calendarId"      integer NOT NULL,
        "externalEventId" character varying(1024) NOT NULL,
        "meet_link"       text,
        "createdAt"       TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"       TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_calendar_event_calendar_booking" UNIQUE ("calendarId", "bookingId"),
        CONSTRAINT "PK_176fe24e6eb48c3fef696c7641f" PRIMARY KEY ("id"),
        CONSTRAINT "FK_022dfc7688e8bd045a570d2aabe"
          FOREIGN KEY ("bookingId") REFERENCES "bookings"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_80ab7835e1749581a27462eb87f"
          FOREIGN KEY ("calendarId") REFERENCES "calendar"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_calendar_event_booking"
        ON "calendar_event" ("bookingId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_calendar_event_booking"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "calendar_event"`);
  }
}
