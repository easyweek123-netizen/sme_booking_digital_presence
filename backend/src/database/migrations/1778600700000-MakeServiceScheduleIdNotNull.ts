import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeServiceScheduleIdNotNull1778600700000 implements MigrationInterface {
  name = 'MakeServiceScheduleIdNotNull1778600700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';

    if (isMysql) {
      await queryRunner.query(`
        UPDATE services s
        JOIN business b ON b.id = s.businessId
        SET s.schedule_id = b.default_schedule_id
        WHERE s.schedule_id IS NULL AND b.default_schedule_id IS NOT NULL
      `);
      await queryRunner.query(
        `ALTER TABLE services DROP FOREIGN KEY fk_service_schedule`,
      );
      await queryRunner.query(
        `ALTER TABLE services MODIFY COLUMN schedule_id INT NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE services ADD CONSTRAINT fk_service_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE RESTRICT`,
      );
    } else {
      await queryRunner.query(`
        UPDATE "services" s
        SET "schedule_id" = b."default_schedule_id"
        FROM "business" b
        WHERE b."id" = s."businessId"
          AND s."schedule_id" IS NULL
          AND b."default_schedule_id" IS NOT NULL
      `);
      await queryRunner.query(
        `ALTER TABLE "services" ALTER COLUMN "schedule_id" SET NOT NULL`,
      );
      await queryRunner.query(`
        DO $$
        DECLARE
          fk_name text;
        BEGIN
          SELECT conname INTO fk_name
          FROM pg_constraint
          WHERE conrelid = '"services"'::regclass
            AND contype = 'f'
            AND pg_get_constraintdef(oid) ILIKE '%REFERENCES "schedule"%';
          IF fk_name IS NOT NULL THEN
            EXECUTE format('ALTER TABLE "services" DROP CONSTRAINT %I', fk_name);
          END IF;
        END$$;
      `);
      await queryRunner.query(
        `ALTER TABLE "services" ADD CONSTRAINT "fk_service_schedule" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';

    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE services DROP FOREIGN KEY fk_service_schedule`,
      );
      await queryRunner.query(
        `ALTER TABLE services MODIFY COLUMN schedule_id INT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE services ADD CONSTRAINT fk_service_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE SET NULL`,
      );
    } else {
      await queryRunner.query(
        `ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "fk_service_schedule"`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ALTER COLUMN "schedule_id" DROP NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD CONSTRAINT "fk_service_schedule" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE SET NULL`,
      );
    }
  }
}
