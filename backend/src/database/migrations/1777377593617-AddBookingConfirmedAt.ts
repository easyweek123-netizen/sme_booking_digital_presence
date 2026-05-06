import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingConfirmedAt1777377593617 implements MigrationInterface {
  name = 'AddBookingConfirmedAt1777377593617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      const table = await queryRunner.getTable('bookings');
      const hasCol = table?.findColumnByName('confirmedAt');
      if (!hasCol) {
        await queryRunner.query(
          `ALTER TABLE \`bookings\` ADD COLUMN \`confirmedAt\` TIMESTAMP NULL`,
        );
        await queryRunner.query(`
          UPDATE \`bookings\`
          SET \`confirmedAt\` = \`createdAt\`
          WHERE \`status\` = 'CONFIRMED' AND \`confirmedAt\` IS NULL
        `);
      }
      return;
    }

    const bookingsTable = await queryRunner.getTable('bookings');
    const hasConfirmedAt = bookingsTable?.findColumnByName('confirmedAt');
    if (!hasConfirmedAt) {
      await queryRunner.query(`
        ALTER TABLE "bookings"
        ADD COLUMN "confirmedAt" TIMESTAMP NULL
      `);
      await queryRunner.query(`
        UPDATE "bookings"
        SET "confirmedAt" = "createdAt"
        WHERE "status" = 'CONFIRMED' AND "confirmedAt" IS NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      await queryRunner.query(
        `ALTER TABLE \`bookings\` DROP COLUMN IF EXISTS \`confirmedAt\``,
      );
      return;
    }

    const bookingsTable = await queryRunner.getTable('bookings');
    if (bookingsTable?.findColumnByName('confirmedAt')) {
      await queryRunner.query(
        `ALTER TABLE "bookings" DROP COLUMN "confirmedAt"`,
      );
    }
  }
}
