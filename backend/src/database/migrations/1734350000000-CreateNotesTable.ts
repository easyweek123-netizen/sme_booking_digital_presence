import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateNotesTable1734350000000 implements MigrationInterface {
  name = 'CreateNotesTable1734350000000';

  /**
   * Check if a foreign key exists on a table
   */
  private async hasForeignKey(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ): Promise<boolean> {
    const table = await queryRunner.getTable(tableName);
    if (!table) return false;
    
    return table.foreignKeys.some((fk) => fk.columnNames.includes(columnName));
  }

  /**
   * Check if an index exists on a table
   */
  private async hasIndex(
    queryRunner: QueryRunner,
    tableName: string,
    indexName: string,
  ): Promise<boolean> {
    const table = await queryRunner.getTable(tableName);
    if (!table) return false;
    
    return table.indices.some((idx) => idx.name === indexName);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table already exists
    const tableExists = await queryRunner.hasTable('notes');
    
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'notes',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'content',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'customerId',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'bookingId',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'ownerId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }

    // Create foreign keys (only if they don't exist)
    if (!(await this.hasForeignKey(queryRunner, 'notes', 'customerId'))) {
      try {
        await queryRunner.createForeignKey(
          'notes',
          new TableForeignKey({
            columnNames: ['customerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'CASCADE',
          }),
        );
      } catch (error) {
        console.error('Error creating foreign key notes->customers:', error);
      }
    }

    if (!(await this.hasForeignKey(queryRunner, 'notes', 'bookingId'))) {
      try {
        await queryRunner.createForeignKey(
          'notes',
          new TableForeignKey({
            columnNames: ['bookingId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'bookings',
            onDelete: 'CASCADE',
          }),
        );
      } catch (error) {
        console.error('Error creating foreign key notes->bookings:', error);
      }
    }

    if (!(await this.hasForeignKey(queryRunner, 'notes', 'ownerId'))) {
      try {
        await queryRunner.createForeignKey(
          'notes',
          new TableForeignKey({
            columnNames: ['ownerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'owners',
            onDelete: 'CASCADE',
          }),
        );
      } catch (error) {
        console.error('Error creating foreign key notes->owners:', error);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('notes');
    
    if (tableExists) {
      // Drop indexes (only if they exist)
      if (await this.hasIndex(queryRunner, 'notes', 'IDX_notes_customerId')) {
        try {
          await queryRunner.dropIndex('notes', 'IDX_notes_customerId');
        } catch (error) {
          console.error('Error dropping index IDX_notes_customerId:', error);
        }
      }
      
      if (await this.hasIndex(queryRunner, 'notes', 'IDX_notes_bookingId')) {
        try {
          await queryRunner.dropIndex('notes', 'IDX_notes_bookingId');
        } catch (error) {
          console.error('Error dropping index IDX_notes_bookingId:', error);
        }
      }

      if (await this.hasIndex(queryRunner, 'notes', 'IDX_notes_ownerId')) {
        try {
          await queryRunner.dropIndex('notes', 'IDX_notes_ownerId');
        } catch (error) {
          console.error('Error dropping index IDX_notes_ownerId:', error);
        }
      }

      await queryRunner.dropTable('notes');
    }
  }
}
