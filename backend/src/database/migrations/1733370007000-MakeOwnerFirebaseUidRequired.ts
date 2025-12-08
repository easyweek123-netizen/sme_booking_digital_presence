import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOwnerFirebaseUidRequired1733370007000 implements MigrationInterface {
  name = 'MakeOwnerFirebaseUidRequired1733370007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete any owners without a firebaseUid (shouldn't exist after Firebase migration)
    await queryRunner.query(`DELETE FROM "owners" WHERE "firebaseUid" IS NULL`);

    // Make firebaseUid NOT NULL
    await queryRunner.query(`ALTER TABLE "owners" ALTER COLUMN "firebaseUid" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Make firebaseUid nullable again
    await queryRunner.query(`ALTER TABLE "owners" ALTER COLUMN "firebaseUid" DROP NOT NULL`);
  }
}

