import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessLocationsRevamp1780743823537 implements MigrationInterface {
  name = 'BusinessLocationsRevamp1780743823537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 2. Drop legacy flat contact columns on business.
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "phone"`,
    );

    // 3. Add page-visibility flags. Saved this sprint, consumed in a later phase
    //    by the public booking page.
    await queryRunner.query(`
      ALTER TABLE "business"
        ADD COLUMN IF NOT EXISTS "show_next_available" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "business"
        ADD COLUMN IF NOT EXISTS "show_weekly_hours" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "show_weekly_hours"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN IF EXISTS "show_next_available"`,
    );
    await queryRunner.query(`
      ALTER TABLE "business" ADD COLUMN IF NOT EXISTS "phone" character varying(20)
    `);
    await queryRunner.query(`
      ALTER TABLE "business" ADD COLUMN IF NOT EXISTS "city" character varying(100)
    `);
    await queryRunner.query(`
      ALTER TABLE "business" ADD COLUMN IF NOT EXISTS "address" character varying(255)
    `);
  }
}
