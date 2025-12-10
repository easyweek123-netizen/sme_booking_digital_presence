import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateServiceCategoriesTable1733400000000 implements MigrationInterface {
  name = 'CreateServiceCategoriesTable1733400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table already exists
    const tableExists = await queryRunner.hasTable('service_categories');
    
    if (!tableExists) {
      // Create service_categories table
      await queryRunner.createTable(
        new Table({
          name: 'service_categories',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'businessId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'displayOrder',
              type: 'int',
              default: 0,
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

      // Add foreign key to businesses table
      await queryRunner.createForeignKey(
        'service_categories',
        new TableForeignKey({
          columnNames: ['businessId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'businesses',
          onDelete: 'CASCADE',
        }),
      );
      
      console.log('✅ Created service_categories table');
    } else {
      console.log('⏭️  Table service_categories already exists, skipping...');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('service_categories');
    
    if (tableExists) {
      // Drop foreign key first
      const table = await queryRunner.getTable('service_categories');
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('businessId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('service_categories', foreignKey);
      }

      // Drop the table
      await queryRunner.dropTable('service_categories');
      console.log('✅ Dropped service_categories table');
    }
  }
}

