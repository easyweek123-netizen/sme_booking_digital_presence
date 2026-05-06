import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageSuggestions1777600140000 implements MigrationInterface {
  name = 'AddMessageSuggestions1777600140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    // MySQL
    if (dbType === 'mysql') {
      const hasMessage = await queryRunner.hasTable('message');
      if (!hasMessage) return;

      const cols = await queryRunner.query(
        "SHOW COLUMNS FROM `message` LIKE 'suggestions'",
      );
      if (Array.isArray(cols) && cols.length > 0) return;

      await queryRunner.query(
        'ALTER TABLE `message` ADD COLUMN `suggestions` TEXT NULL',
      );
      return;
    }

    // Postgres
    const hasMessage = await queryRunner.hasTable('message');
    if (!hasMessage) return;

    const exists = await queryRunner.query(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_name = 'message' AND column_name = 'suggestions'
       LIMIT 1;`,
    );
    if (Array.isArray(exists) && exists.length > 0) return;

    await queryRunner.query(
      'ALTER TABLE "message" ADD COLUMN "suggestions" text NULL;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      const hasMessage = await queryRunner.hasTable('message');
      if (!hasMessage) return;

      const cols = await queryRunner.query(
        "SHOW COLUMNS FROM `message` LIKE 'suggestions'",
      );
      if (!Array.isArray(cols) || cols.length === 0) return;

      await queryRunner.query('ALTER TABLE `message` DROP COLUMN `suggestions`');
      return;
    }

    const hasMessage = await queryRunner.hasTable('message');
    if (!hasMessage) return;

    const exists = await queryRunner.query(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_name = 'message' AND column_name = 'suggestions'
       LIMIT 1;`,
    );
    if (!Array.isArray(exists) || exists.length === 0) return;

    await queryRunner.query(
      'ALTER TABLE "message" DROP COLUMN "suggestions";',
    );
  }
}

