import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFeedbackTable1733500000000 implements MigrationInterface {
  name = 'CreateFeedbackTable1733500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table already exists
    const tableExists = await queryRunner.hasTable('feedback');
    
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'feedback',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
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
              default: "'pricing_page'",
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true, // ifNotExists
      );

      // Create index on email for faster lookups
      const indexExists = await queryRunner.hasTable('feedback');
      if (indexExists) {
        try {
          await queryRunner.createIndex(
            'feedback',
            new TableIndex({
              name: 'IDX_feedback_email',
              columnNames: ['email'],
            }),
          );
        } catch {
          // Index might already exist, ignore
        }

        try {
          await queryRunner.createIndex(
            'feedback',
            new TableIndex({
              name: 'IDX_feedback_createdAt',
              columnNames: ['createdAt'],
            }),
          );
        } catch {
          // Index might already exist, ignore
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('feedback');
    
    if (tableExists) {
      // Drop indexes first
      try {
        await queryRunner.dropIndex('feedback', 'IDX_feedback_email');
      } catch {
        // Index might not exist
      }
      
      try {
        await queryRunner.dropIndex('feedback', 'IDX_feedback_createdAt');
      } catch {
        // Index might not exist
      }

      await queryRunner.dropTable('feedback');
    }
  }
}

