import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwnerFirebaseUidIndex1733370008000 implements MigrationInterface {
  name = 'AddOwnerFirebaseUidIndex1733370008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add index on firebaseUid for faster lookups (customers table already has this)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_owners_firebaseUid" ON "owners" ("firebaseUid")
    `);
    console.log('Created index on owners.firebaseUid');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_owners_firebaseUid"`);
    console.log('Dropped index on owners.firebaseUid');
  }
}

