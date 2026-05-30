import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the deferred circular FK: business.default_schedule_id → schedule.id (SET NULL).
 *
 * Why deferred: business and schedule reference each other, so `CreateBusiness` was
 * written without this FK to avoid a dependency on a table that didn't exist yet.
 * `CreateSchedule` carries its side (business_id → business) normally.
 *
 * Why the EXCEPTION guard: Postgres has no ADD CONSTRAINT IF NOT EXISTS.
 * The Railway DB was built via synchronize:true and already has this constraint,
 * so the guard lets the migration run as a safe no-op there.
 */
export class AddBusinessDefaultScheduleFk1780163241895 implements MigrationInterface {
  name = 'AddBusinessDefaultScheduleFk1780163241895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "business"
          ADD CONSTRAINT "FK_2d05be4837ddcb1d498fd2061c0"
          FOREIGN KEY ("default_schedule_id") REFERENCES "schedule"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "business"
        DROP CONSTRAINT IF EXISTS "FK_2d05be4837ddcb1d498fd2061c0"
    `);
  }
}
