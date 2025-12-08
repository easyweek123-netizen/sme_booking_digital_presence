import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOwnerForFirebase1733370002000 implements MigrationInterface {
  name = 'UpdateOwnerForFirebase1733370002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Safety check: Verify owners table is empty before schema change
    const ownerCount = await queryRunner.query(
      `SELECT COUNT(*) as count FROM "owners"`,
    );
    
    if (parseInt(ownerCount[0].count) > 0) {
      throw new Error(
        'Cannot run migration: Owners table is not empty. Run ResetOwners migration first.',
      );
    }

    // Add firebaseUid column if it doesn't exist
    const firebaseUidExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'firebaseUid'
    `);
    
    if (firebaseUidExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" ADD COLUMN "firebaseUid" VARCHAR(128) UNIQUE`,
      );
      console.log('Added firebaseUid column to owners table.');
    }

    // Drop passwordHash column if it exists
    const passwordHashExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'passwordHash'
    `);
    
    if (passwordHashExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" DROP COLUMN "passwordHash"`,
      );
      console.log('Dropped passwordHash column from owners table.');
    }

    // Drop googleId column if it exists
    const googleIdExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'googleId'
    `);
    
    if (googleIdExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" DROP COLUMN "googleId"`,
      );
      console.log('Dropped googleId column from owners table.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: add back passwordHash and googleId, remove firebaseUid
    const firebaseUidExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'firebaseUid'
    `);
    
    if (firebaseUidExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" DROP COLUMN "firebaseUid"`,
      );
    }

    const passwordHashExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'passwordHash'
    `);
    
    if (passwordHashExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" ADD COLUMN "passwordHash" VARCHAR(255)`,
      );
    }

    const googleIdExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'owners' AND column_name = 'googleId'
    `);
    
    if (googleIdExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "owners" ADD COLUMN "googleId" VARCHAR(255) UNIQUE`,
      );
    }
  }
}

