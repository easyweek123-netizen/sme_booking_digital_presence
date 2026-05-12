import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCalendarSyncSchema1778000000000 implements MigrationInterface {
  name = 'AddCalendarSyncSchema1778000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);
    const ts = isMysql ? 'TIMESTAMP NULL' : 'TIMESTAMP NULL';
    const tsDefault = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const tsUpdate = isMysql
      ? 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      : 'TIMESTAMP NOT NULL DEFAULT now()';
    const pk = isMysql
      ? 'INT AUTO_INCREMENT PRIMARY KEY'
      : 'SERIAL PRIMARY KEY';

    // 1. business.timezone (idempotent)
    const business = await queryRunner.getTable('business');
    if (!business?.findColumnByName('timezone')) {
      await queryRunner.query(
        q(
          `ALTER TABLE "business" ADD COLUMN "timezone" VARCHAR(64) NOT NULL DEFAULT 'Europe/Vienna'`,
        ),
      );
    }

    // 2. calendar_integration
    const hasIntegration = await queryRunner.hasTable('calendar_integration');
    if (!hasIntegration) {
      await queryRunner.query(
        q(`
        CREATE TABLE "calendar_integration" (
          "id" ${pk},
          "businessId" INT NOT NULL,
          "provider" VARCHAR(20) NOT NULL,
          "providerAccountEmail" VARCHAR(255) NULL,
          "refreshToken" TEXT NULL,
          "scope" TEXT NULL,
          "status" VARCHAR(20) NOT NULL DEFAULT 'disconnected',
          "lastError" TEXT NULL,
          "lastSyncAt" ${ts},
          "disconnectedAt" ${ts},
          "createdAt" ${tsDefault},
          "updatedAt" ${tsUpdate},
          CONSTRAINT "UQ_calendar_integration_business_provider" UNIQUE ("businessId","provider"),
          CONSTRAINT "FK_calendar_integration_business"
            FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE
        )
      `),
      );
      await queryRunner.query(
        q(
          `CREATE INDEX "IDX_calendar_integration_business" ON "calendar_integration" ("businessId")`,
        ),
      );
    }

    // 3. calendar_event_mapping
    const hasMapping = await queryRunner.hasTable('calendar_event_mapping');
    if (!hasMapping) {
      await queryRunner.query(
        q(`
        CREATE TABLE "calendar_event_mapping" (
          "id" ${pk},
          "bookingId" INT NOT NULL,
          "integrationId" INT NOT NULL,
          "externalEventId" VARCHAR(1024) NOT NULL,
          "createdAt" ${tsDefault},
          "updatedAt" ${tsUpdate},
          CONSTRAINT "UQ_mapping_integration_booking" UNIQUE ("integrationId","bookingId"),
          CONSTRAINT "FK_mapping_booking"
            FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_mapping_integration"
            FOREIGN KEY ("integrationId") REFERENCES "calendar_integration"("id") ON DELETE CASCADE
        )
      `),
      );
      await queryRunner.query(
        q(
          `CREATE INDEX "IDX_mapping_booking" ON "calendar_event_mapping" ("bookingId")`,
        ),
      );
      await queryRunner.query(
        q(
          `CREATE INDEX "IDX_mapping_integration" ON "calendar_event_mapping" ("integrationId")`,
        ),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);
    await queryRunner.query(q(`DROP TABLE IF EXISTS "calendar_event_mapping"`));
    await queryRunner.query(q(`DROP TABLE IF EXISTS "calendar_integration"`));
    await queryRunner.query(q(`ALTER TABLE "business" DROP COLUMN "timezone"`));
  }
}
