import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupCalendarSchema1778500000000 implements MigrationInterface {
  name = 'CleanupCalendarSchema1778500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);

    await this.renameOrCreateCalendar(queryRunner, q, isMysql);
    await this.renameOrCreateCalendarEvent(queryRunner, q, isMysql);
    await this.renameOrCreateCalendarSyncLog(queryRunner, q, isMysql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);

    if (await queryRunner.hasTable('calendar_sync_log')) {
      await queryRunner.query(
        q(`ALTER TABLE "calendar_sync_log" RENAME TO "calendar_sync_event"`),
      );
      const t = await queryRunner.getTable('calendar_sync_event');
      if (!t?.findColumnByName('attempt')) {
        await queryRunner.query(
          q(
            `ALTER TABLE "calendar_sync_event" ADD COLUMN "attempt" INT NOT NULL DEFAULT 1`,
          ),
        );
      }
    }
    if (await queryRunner.hasTable('calendar_event')) {
      await queryRunner.query(
        q(`ALTER TABLE "calendar_event" RENAME TO "calendar_event_mapping"`),
      );
    }
    if (await queryRunner.hasTable('calendar')) {
      await queryRunner.query(
        q(`ALTER TABLE "calendar" RENAME TO "calendar_integration"`),
      );
    }
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private async renameOrCreateCalendar(
    qr: QueryRunner,
    q: (s: string) => string,
    isMysql: boolean,
  ) {
    if (await qr.hasTable('calendar')) return; // already migrated
    if (await qr.hasTable('calendar_integration')) {
      await qr.query(
        q(`ALTER TABLE "calendar_integration" RENAME TO "calendar"`),
      );
      return;
    }
    const ts = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const tsUpd = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const pk = isMysql
      ? 'INT AUTO_INCREMENT PRIMARY KEY'
      : 'SERIAL PRIMARY KEY';
    await qr.query(
      q(`
      CREATE TABLE "calendar" (
        "id" ${pk},
        "businessId" INT NOT NULL,
        "provider" VARCHAR(20) NOT NULL,
        "providerAccountEmail" VARCHAR(255) NULL,
        "refreshToken" TEXT NULL,
        "scope" TEXT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'disconnected',
        "lastError" TEXT NULL,
        "lastSyncAt" TIMESTAMP NULL,
        "disconnectedAt" TIMESTAMP NULL,
        "createdAt" ${ts},
        "updatedAt" ${tsUpd},
        CONSTRAINT "UQ_calendar_business_provider" UNIQUE ("businessId","provider"),
        CONSTRAINT "FK_calendar_business" FOREIGN KEY ("businessId")
          REFERENCES "business"("id") ON DELETE CASCADE
      )
    `),
    );
    await qr.query(
      q(`CREATE INDEX "IDX_calendar_business" ON "calendar" ("businessId")`),
    );
  }

  private async renameOrCreateCalendarEvent(
    qr: QueryRunner,
    q: (s: string) => string,
    isMysql: boolean,
  ) {
    if (await qr.hasTable('calendar_event')) {
      await this.renameColumnIfPresent(
        qr,
        q,
        'calendar_event',
        'integrationId',
        'calendarId',
      );
      return;
    }
    if (await qr.hasTable('calendar_event_mapping')) {
      await qr.query(
        q(`ALTER TABLE "calendar_event_mapping" RENAME TO "calendar_event"`),
      );
      await this.renameColumnIfPresent(
        qr,
        q,
        'calendar_event',
        'integrationId',
        'calendarId',
      );
      return;
    }
    const ts = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const tsUpd = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const pk = isMysql
      ? 'INT AUTO_INCREMENT PRIMARY KEY'
      : 'SERIAL PRIMARY KEY';
    await qr.query(
      q(`
      CREATE TABLE "calendar_event" (
        "id" ${pk},
        "bookingId" INT NOT NULL,
        "calendarId" INT NOT NULL,
        "externalEventId" VARCHAR(1024) NOT NULL,
        "createdAt" ${ts},
        "updatedAt" ${tsUpd},
        CONSTRAINT "UQ_calendar_event_calendar_booking" UNIQUE ("calendarId","bookingId"),
        CONSTRAINT "FK_calendar_event_booking" FOREIGN KEY ("bookingId")
          REFERENCES "bookings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_calendar_event_calendar" FOREIGN KEY ("calendarId")
          REFERENCES "calendar"("id") ON DELETE CASCADE
      )
    `),
    );
    await qr.query(
      q(
        `CREATE INDEX "IDX_calendar_event_booking" ON "calendar_event" ("bookingId")`,
      ),
    );
    await qr.query(
      q(
        `CREATE INDEX "IDX_calendar_event_calendar" ON "calendar_event" ("calendarId")`,
      ),
    );
  }

  private async renameOrCreateCalendarSyncLog(
    qr: QueryRunner,
    q: (s: string) => string,
    isMysql: boolean,
  ) {
    if (await qr.hasTable('calendar_sync_log')) {
      await this.dropAttemptIfPresent(qr, q, 'calendar_sync_log');
      return;
    }
    if (await qr.hasTable('calendar_sync_event')) {
      await qr.query(
        q(`ALTER TABLE "calendar_sync_event" RENAME TO "calendar_sync_log"`),
      );
      // also rename the column from "integrationId" → "calendarId" for naming consistency
      await this.renameColumnIfPresent(
        qr,
        q,
        'calendar_sync_log',
        'integrationId',
        'calendarId',
      );
      await this.dropAttemptIfPresent(qr, q, 'calendar_sync_log');
      return;
    }
    const ts = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const pk = isMysql
      ? 'INT AUTO_INCREMENT PRIMARY KEY'
      : 'SERIAL PRIMARY KEY';
    await qr.query(
      q(`
      CREATE TABLE "calendar_sync_log" (
        "id" ${pk},
        "calendarId" INT NOT NULL,
        "bookingId" INT NULL,
        "operation" VARCHAR(30) NOT NULL,
        "status" VARCHAR(10) NOT NULL,
        "errorCode" VARCHAR(50) NULL,
        "errorMessage" TEXT NULL,
        "externalEventId" VARCHAR(1024) NULL,
        "createdAt" ${ts},
        CONSTRAINT "FK_sync_log_calendar" FOREIGN KEY ("calendarId")
          REFERENCES "calendar"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sync_log_booking" FOREIGN KEY ("bookingId")
          REFERENCES "bookings"("id") ON DELETE SET NULL
      )
    `),
    );
    await qr.query(
      q(
        `CREATE INDEX "IDX_sync_log_calendar_created" ON "calendar_sync_log" ("calendarId","createdAt")`,
      ),
    );
  }

  private async dropAttemptIfPresent(
    qr: QueryRunner,
    q: (s: string) => string,
    table: string,
  ) {
    const t = await qr.getTable(table);
    if (t?.findColumnByName('attempt')) {
      await qr.query(q(`ALTER TABLE "${table}" DROP COLUMN "attempt"`));
    }
  }

  private async renameColumnIfPresent(
    qr: QueryRunner,
    q: (s: string) => string,
    table: string,
    oldName: string,
    newName: string,
  ) {
    const t = await qr.getTable(table);
    if (t?.findColumnByName(oldName) && !t.findColumnByName(newName)) {
      // postgres + mysql both support ALTER TABLE ... RENAME COLUMN
      await qr.query(
        q(`ALTER TABLE "${table}" RENAME COLUMN "${oldName}" TO "${newName}"`),
      );
    }
  }
}
