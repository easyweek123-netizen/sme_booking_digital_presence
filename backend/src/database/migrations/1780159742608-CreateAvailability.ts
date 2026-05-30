import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAvailability1780159742608 implements MigrationInterface {
  name = 'CreateAvailability1780159742608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "availability" (
        "id"           SERIAL NOT NULL,
        "schedule_id"  integer NOT NULL,
        "is_recurring" boolean NOT NULL,
        "day_of_week"  smallint,
        "date"         date,
        "start_time"   TIME,
        "end_time"     TIME,
        "is_closed"    boolean NOT NULL DEFAULT false,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"),
        CONSTRAINT "FK_9f10e9344e85a3ee1548598327f"
          FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_avail_schedule_recur"
        ON "availability" ("schedule_id", "is_recurring", "day_of_week")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_avail_schedule_date"
        ON "availability" ("schedule_id", "date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_avail_schedule_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_avail_schedule_recur"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "availability"`);
  }
}
