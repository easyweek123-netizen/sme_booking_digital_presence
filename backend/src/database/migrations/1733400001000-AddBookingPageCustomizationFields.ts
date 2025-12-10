import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddBookingPageCustomizationFields1733400001000 implements MigrationInterface {
  name = 'AddBookingPageCustomizationFields1733400001000';

  /**
   * Helper to check if a column exists in a table
   */
  private async hasColumn(queryRunner: QueryRunner, tableName: string, columnName: string): Promise<boolean> {
    const table = await queryRunner.getTable(tableName);
    return table?.columns.some(col => col.name === columnName) ?? false;
  }

  /**
   * Helper to safely add a column if it doesn't exist
   */
  private async addColumnIfNotExists(
    queryRunner: QueryRunner,
    tableName: string,
    column: TableColumn,
  ): Promise<void> {
    const exists = await this.hasColumn(queryRunner, tableName, column.name);
    if (!exists) {
      await queryRunner.addColumn(tableName, column);
      console.log(`✅ Added column ${tableName}.${column.name}`);
    } else {
      console.log(`⏭️  Column ${tableName}.${column.name} already exists, skipping...`);
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to businesses table
    await this.addColumnIfNotExists(
      queryRunner,
      'businesses',
      new TableColumn({
        name: 'coverImageUrl',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    await this.addColumnIfNotExists(
      queryRunner,
      'businesses',
      new TableColumn({
        name: 'aboutContent',
        type: 'text',
        isNullable: true,
      }),
    );

    // Add new columns to services table
    await this.addColumnIfNotExists(
      queryRunner,
      'services',
      new TableColumn({
        name: 'categoryId',
        type: 'int',
        isNullable: true,
      }),
    );

    await this.addColumnIfNotExists(
      queryRunner,
      'services',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      }),
    );

    await this.addColumnIfNotExists(
      queryRunner,
      'services',
      new TableColumn({
        name: 'imageUrl',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    await this.addColumnIfNotExists(
      queryRunner,
      'services',
      new TableColumn({
        name: 'displayOrder',
        type: 'int',
        default: 0,
      }),
    );

    // Add foreign key from services.categoryId to service_categories.id (if not exists)
    const servicesTable = await queryRunner.getTable('services');
    const existingFk = servicesTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );
    
    if (!existingFk) {
      // Only add FK if service_categories table exists
      const categoryTableExists = await queryRunner.hasTable('service_categories');
      if (categoryTableExists) {
        await queryRunner.createForeignKey(
          'services',
          new TableForeignKey({
            columnNames: ['categoryId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'service_categories',
            onDelete: 'SET NULL',
          }),
        );
        console.log('✅ Added foreign key services.categoryId -> service_categories.id');
      } else {
        console.log('⚠️  service_categories table not found, skipping FK creation');
      }
    } else {
      console.log('⏭️  Foreign key for categoryId already exists, skipping...');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key from services (if exists)
    const servicesTable = await queryRunner.getTable('services');
    const foreignKey = servicesTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('services', foreignKey);
      console.log('✅ Dropped foreign key for categoryId');
    }

    // Remove columns from services table (if exist)
    const serviceColumns = ['categoryId', 'description', 'imageUrl', 'displayOrder'];
    for (const colName of serviceColumns) {
      if (await this.hasColumn(queryRunner, 'services', colName)) {
        await queryRunner.dropColumn('services', colName);
        console.log(`✅ Dropped column services.${colName}`);
      }
    }

    // Remove columns from businesses table (if exist)
    const businessColumns = ['coverImageUrl', 'aboutContent'];
    for (const colName of businessColumns) {
      if (await this.hasColumn(queryRunner, 'businesses', colName)) {
        await queryRunner.dropColumn('businesses', colName);
        console.log(`✅ Dropped column businesses.${colName}`);
      }
    }
  }
}

