import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceShapeColumns1778600300000 implements MigrationInterface {
  name = 'AddServiceShapeColumns1778600300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    const t = isMysql ? 'services' : '"services"';
    const q = (s: string) => (isMysql ? s.replace(/"/g, '`') : s);

    if (isMysql) {
      await queryRunner.query(`
        ALTER TABLE services
        ADD COLUMN type VARCHAR(16) NOT NULL DEFAULT 'APPOINTMENT',
        ADD COLUMN capacity INT NOT NULL DEFAULT 1,
        ADD COLUMN pause_after_minutes INT NOT NULL DEFAULT 0,
        ADD COLUMN price_type VARCHAR(16) NOT NULL DEFAULT 'FIXED',
        ADD COLUMN location_type VARCHAR(16) NOT NULL DEFAULT 'AT_BUSINESS',
        ADD COLUMN location_meta JSON NULL,
        ADD COLUMN color VARCHAR(7) NULL,
        ADD COLUMN photo_url TEXT NULL,
        ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      await queryRunner.query(
        `ALTER TABLE services DROP COLUMN available_days`,
      );
      await queryRunner.query(`ALTER TABLE services DROP COLUMN image_url`);
    } else {
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "type" VARCHAR(16) NOT NULL DEFAULT 'APPOINTMENT'`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "capacity" INT NOT NULL DEFAULT 1`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "pause_after_minutes" INT NOT NULL DEFAULT 0`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "price_type" VARCHAR(16) NOT NULL DEFAULT 'FIXED'`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "location_type" VARCHAR(16) NOT NULL DEFAULT 'AT_BUSINESS'`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "location_meta" JSONB NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "color" VARCHAR(7) NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "photo_url" TEXT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" DROP COLUMN IF EXISTS "available_days"`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" DROP COLUMN IF EXISTS "image_url"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE services ADD COLUMN available_days JSON NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE services ADD COLUMN image_url VARCHAR(500) NULL`,
      );
      await queryRunner.query(`
        ALTER TABLE services
        DROP COLUMN updated_at,
        DROP COLUMN photo_url,
        DROP COLUMN color,
        DROP COLUMN location_meta,
        DROP COLUMN location_type,
        DROP COLUMN price_type,
        DROP COLUMN pause_after_minutes,
        DROP COLUMN capacity,
        DROP COLUMN type
      `);
    } else {
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "available_days" JSON NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(500) NULL`,
      );
      for (const col of [
        'updated_at',
        'photo_url',
        'color',
        'location_meta',
        'location_type',
        'price_type',
        'pause_after_minutes',
        'capacity',
        'type',
      ]) {
        await queryRunner.query(
          `ALTER TABLE "services" DROP COLUMN IF EXISTS "${col}"`,
        );
      }
    }
  }
}
