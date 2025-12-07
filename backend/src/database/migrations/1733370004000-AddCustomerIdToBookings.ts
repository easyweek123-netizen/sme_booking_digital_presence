import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerIdToBookings1733370004000 implements MigrationInterface {
  name = 'AddCustomerIdToBookings1733370004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Safety check: Only add column if it doesn't exist
    const columnExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'customerId'
    `);
    
    if (columnExists.length === 0) {
      // Add customerId column (nullable for existing bookings)
      await queryRunner.query(`
        ALTER TABLE "bookings" 
        ADD COLUMN "customerId" INTEGER REFERENCES "customers"("id")
      `);
      
      // Create index for faster customer lookups
      await queryRunner.query(`
        CREATE INDEX "IDX_bookings_customerId" ON "bookings" ("customerId")
      `);
      
      console.log('Added customerId column to bookings table.');
    } else {
      console.log('customerId column already exists in bookings table.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_customerId"`);
    
    // Drop column
    await queryRunner.query(`
      ALTER TABLE "bookings" DROP COLUMN IF EXISTS "customerId"
    `);
    
    console.log('Removed customerId column from bookings table.');
  }
}

