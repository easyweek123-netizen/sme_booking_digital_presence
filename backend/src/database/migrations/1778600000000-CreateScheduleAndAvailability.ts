import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScheduleAndAvailability1778600000000 implements MigrationInterface {
  name = 'CreateScheduleAndAvailability1778600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';

    if (isMysql) {
      await queryRunner.query(`DROP TABLE IF EXISTS availability`);
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS schedule (
          id INT AUTO_INCREMENT PRIMARY KEY,
          business_id INT NOT NULL,
          name VARCHAR(120) NOT NULL DEFAULT 'Default',
          timezone VARCHAR(64) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_schedule_business FOREIGN KEY (business_id) REFERENCES business(id) ON DELETE CASCADE,
          INDEX idx_schedule_business (business_id)
        )
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS availability (
          id INT AUTO_INCREMENT PRIMARY KEY,
          schedule_id INT NOT NULL,
          is_recurring TINYINT(1) NOT NULL,
          day_of_week SMALLINT NULL,
          date DATE NULL,
          start_time TIME NULL,
          end_time TIME NULL,
          is_closed TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_avail_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
          INDEX idx_avail_schedule_recur (schedule_id, is_recurring, day_of_week),
          INDEX idx_avail_schedule_date (schedule_id, date)
        )
      `);

      await queryRunner.query(
        `ALTER TABLE business ADD COLUMN default_schedule_id INT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE business ADD CONSTRAINT fk_business_default_schedule FOREIGN KEY (default_schedule_id) REFERENCES schedule(id) ON DELETE SET NULL`,
      );

      await queryRunner.query(
        `ALTER TABLE services ADD COLUMN schedule_id INT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE services ADD CONSTRAINT fk_service_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE SET NULL`,
      );

      await queryRunner.query(`
        INSERT INTO schedule (business_id, name)
        SELECT id, 'Default' FROM business
        WHERE NOT EXISTS (SELECT 1 FROM schedule s WHERE s.business_id = business.id)
      `);
      await queryRunner.query(`
        UPDATE business b
        JOIN schedule s ON s.business_id = b.id AND s.name = 'Default'
        SET b.default_schedule_id = s.id
        WHERE b.default_schedule_id IS NULL
      `);
    } else {
      await queryRunner.query(`DROP TABLE IF EXISTS "availability" CASCADE`);
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "schedule" (
          "id" SERIAL PRIMARY KEY,
          "business_id" INT NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
          "name" VARCHAR(120) NOT NULL DEFAULT 'Default',
          "timezone" VARCHAR(64) NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "idx_schedule_business" ON "schedule" ("business_id")`,
      );

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "availability" (
          "id" SERIAL PRIMARY KEY,
          "schedule_id" INT NOT NULL REFERENCES "schedule"("id") ON DELETE CASCADE,
          "is_recurring" BOOLEAN NOT NULL,
          "day_of_week" SMALLINT NULL,
          "date" DATE NULL,
          "start_time" TIME NULL,
          "end_time" TIME NULL,
          "is_closed" BOOLEAN NOT NULL DEFAULT FALSE,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "idx_avail_schedule_recur" ON "availability" ("schedule_id", "is_recurring", "day_of_week")`,
      );
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "idx_avail_schedule_date" ON "availability" ("schedule_id", "date") WHERE NOT "is_recurring"`,
      );

      await queryRunner.query(
        `ALTER TABLE "business" ADD COLUMN IF NOT EXISTS "default_schedule_id" INT NULL REFERENCES "schedule"("id") ON DELETE SET NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "schedule_id" INT NULL REFERENCES "schedule"("id") ON DELETE SET NULL`,
      );

      await queryRunner.query(`
        INSERT INTO "schedule" ("business_id", "name")
        SELECT b."id", 'Default' FROM "business" b
        WHERE NOT EXISTS (SELECT 1 FROM "schedule" s WHERE s."business_id" = b."id")
      `);
      await queryRunner.query(`
        UPDATE "business" b
        SET "default_schedule_id" = s."id"
        FROM "schedule" s
        WHERE s."business_id" = b."id" AND s."name" = 'Default' AND b."default_schedule_id" IS NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE services DROP FOREIGN KEY fk_service_schedule`,
      );
      await queryRunner.query(`ALTER TABLE services DROP COLUMN schedule_id`);
      await queryRunner.query(
        `ALTER TABLE business DROP FOREIGN KEY fk_business_default_schedule`,
      );
      await queryRunner.query(
        `ALTER TABLE business DROP COLUMN default_schedule_id`,
      );
      await queryRunner.query(`DROP TABLE IF EXISTS availability`);
      await queryRunner.query(`DROP TABLE IF EXISTS schedule`);
    } else {
      await queryRunner.query(
        `ALTER TABLE "services" DROP COLUMN IF EXISTS "schedule_id"`,
      );
      await queryRunner.query(
        `ALTER TABLE "business" DROP COLUMN IF EXISTS "default_schedule_id"`,
      );
      await queryRunner.query(`DROP INDEX IF EXISTS "idx_avail_schedule_date"`);
      await queryRunner.query(
        `DROP INDEX IF EXISTS "idx_avail_schedule_recur"`,
      );
      await queryRunner.query(`DROP TABLE IF EXISTS "availability"`);
      await queryRunner.query(`DROP INDEX IF EXISTS "idx_schedule_business"`);
      await queryRunner.query(`DROP TABLE IF EXISTS "schedule"`);
    }
  }
}
