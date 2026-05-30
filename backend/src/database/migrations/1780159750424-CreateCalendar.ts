import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * IDX_calendar_business (single-column on businessId) is intentionally omitted —
 * it is fully redundant with UQ_calendar_business_provider which leads on businessId.
 * FinalizeConstraints drops it from the existing Railway DB.
 */
export class CreateCalendar1780159750424 implements MigrationInterface {
  name = 'CreateCalendar1780159750424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "calendar" (
        "id"                   SERIAL NOT NULL,
        "businessId"           integer NOT NULL,
        "provider"             character varying(20) NOT NULL,
        "providerAccountEmail" character varying(255),
        "refreshToken"         text,
        "scope"                text,
        "status"               character varying(20) NOT NULL DEFAULT 'disconnected',
        "lastError"            text,
        "lastSyncAt"           TIMESTAMP,
        "disconnectedAt"       TIMESTAMP,
        "createdAt"            TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"            TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_calendar_business_provider" UNIQUE ("businessId", "provider"),
        CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ad61f0996f0218298ffe1040ac4"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "calendar"`);
  }
}
