import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1733370003000 implements MigrationInterface {
  name = 'CreateCustomersTable1733370003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Safety check: Only create if table doesn't exist
    const tableExists = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'customers' AND table_schema = 'public'
    `);
    
    if (tableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "customers" (
          "id" SERIAL PRIMARY KEY,
          "firebaseUid" VARCHAR(128) UNIQUE,
          "email" VARCHAR(255),
          "phone" VARCHAR(20),
          "name" VARCHAR(100) NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Create indexes for faster lookups
      await queryRunner.query(`
        CREATE INDEX "IDX_customers_firebaseUid" ON "customers" ("firebaseUid")
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_customers_email" ON "customers" ("email")
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_customers_phone" ON "customers" ("phone")
      `);
      
      console.log('Created customers table with indexes.');
    } else {
      console.log('Customers table already exists, skipping creation.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_customers_firebaseUid"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_customers_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_customers_phone"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "customers"`);
    
    console.log('Dropped customers table.');
  }
}

