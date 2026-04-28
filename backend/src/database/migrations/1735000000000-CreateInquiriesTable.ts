import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateInquiriesTable1735000000000 implements MigrationInterface {
  name = 'CreateInquiriesTable1735000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('inquiries');

    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'inquiries',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '120',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'company',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'budget',
              type: 'varchar',
              length: '50',
              isNullable: false,
            },
            {
              name: 'message',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'source',
              type: 'varchar',
              length: '50',
              default: "'services_page'",
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );

      try {
        await queryRunner.createIndex(
          'inquiries',
          new TableIndex({
            name: 'IDX_inquiries_email',
            columnNames: ['email'],
          }),
        );
      } catch {
        // ignore
      }

      try {
        await queryRunner.createIndex(
          'inquiries',
          new TableIndex({
            name: 'IDX_inquiries_createdAt',
            columnNames: ['createdAt'],
          }),
        );
      } catch {
        // ignore
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('inquiries');

    if (tableExists) {
      try {
        await queryRunner.dropIndex('inquiries', 'IDX_inquiries_email');
      } catch {
        console.error('Error dropping index IDX_inquiries_email');
      }

      try {
        await queryRunner.dropIndex('inquiries', 'IDX_inquiries_createdAt');
      } catch {
        console.error('Error dropping index IDX_inquiries_createdAt');
      }

      await queryRunner.dropTable('inquiries');
    }
  }
}
