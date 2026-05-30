import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchedule1780159742027 implements MigrationInterface {
  name = 'CreateSchedule1780159742027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "schedule" (
        "id"          SERIAL NOT NULL,
        "business_id" integer NOT NULL,
        "name"        character varying(120) NOT NULL DEFAULT 'Default',
        "timezone"    character varying(64),
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"),
        CONSTRAINT "FK_13ffd5ae630d4cc0d1e4a9c1901"
          FOREIGN KEY ("business_id") REFERENCES "business"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_schedule_business" ON "schedule" ("business_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_schedule_business"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "schedule"`);
  }
}
