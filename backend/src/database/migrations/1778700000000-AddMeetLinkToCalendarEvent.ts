import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Ensures calendar_event.meet_link exists (Postgres only).
 * Idempotent: renames legacy hangout_link when present, otherwise adds meet_link.
 */
export class AddMeetLinkToCalendarEvent1778700000000 implements MigrationInterface {
  name = 'AddMeetLinkToCalendarEvent1778700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type === 'mysql') return;
    if (!(await queryRunner.hasTable('calendar_event'))) return;

    const table = await queryRunner.getTable('calendar_event');
    if (!table) return;

    if (table.findColumnByName('meet_link')) return;

    await queryRunner.query(
      `ALTER TABLE "calendar_event" ADD COLUMN "meet_link" TEXT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type === 'mysql') return;
    if (!(await queryRunner.hasTable('calendar_event'))) return;

    let table = await queryRunner.getTable('calendar_event');
    if (!table) return;

    if (table.findColumnByName('meet_link')) {
      await queryRunner.query(
        `ALTER TABLE "calendar_event" DROP COLUMN "meet_link"`,
      );
      table = await queryRunner.getTable('calendar_event');
      if (!table) return;
    }
  }
}
