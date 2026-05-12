import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCalendarSyncEvents1778100000000 implements MigrationInterface {
  name = 'AddCalendarSyncEvents1778100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);
    const ts = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const pk = isMysql
      ? 'INT AUTO_INCREMENT PRIMARY KEY'
      : 'SERIAL PRIMARY KEY';

    if (await queryRunner.hasTable('calendar_sync_event')) return;

    await queryRunner.query(
      q(`
      CREATE TABLE "calendar_sync_event" (
        "id" ${pk},
        "integrationId" INT NOT NULL,
        "bookingId" INT NULL,
        "operation" VARCHAR(30) NOT NULL,
        "status" VARCHAR(10) NOT NULL,
        "attempt" INT NOT NULL,
        "errorCode" VARCHAR(50) NULL,
        "errorMessage" TEXT NULL,
        "externalEventId" VARCHAR(1024) NULL,
        "createdAt" ${ts},
        CONSTRAINT "FK_sync_event_integration"
          FOREIGN KEY ("integrationId") REFERENCES "calendar_integration"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sync_event_booking"
          FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL
      )
    `),
    );
    await queryRunner.query(
      q(
        `CREATE INDEX "IDX_sync_event_integration_created" ON "calendar_sync_event" ("integrationId","createdAt")`,
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);
    await queryRunner.query(q(`DROP TABLE IF EXISTS "calendar_sync_event"`));
  }
}
