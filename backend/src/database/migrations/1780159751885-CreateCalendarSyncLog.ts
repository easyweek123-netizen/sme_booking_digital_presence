import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalendarSyncLog1780159751885 implements MigrationInterface {
  name = 'CreateCalendarSyncLog1780159751885';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "calendar_sync_log" (
        "id"              SERIAL NOT NULL,
        "calendarId"      integer NOT NULL,
        "bookingId"       integer,
        "operation"       character varying(30) NOT NULL,
        "status"          character varying(10) NOT NULL,
        "errorCode"       character varying(50),
        "errorMessage"    text,
        "externalEventId" character varying(1024),
        "createdAt"       TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ede84623121c8ba39374e0fdb35" PRIMARY KEY ("id"),
        CONSTRAINT "FK_7796e3a3099ae8cc8169b6a7ddc"
          FOREIGN KEY ("calendarId") REFERENCES "calendar"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_08fb688637fa6b13eb72d6db421"
          FOREIGN KEY ("bookingId") REFERENCES "bookings"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_sync_log_calendar_created"
        ON "calendar_sync_log" ("calendarId", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_sync_log_calendar_created"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "calendar_sync_log"`);
  }
}
