import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOwners1780159739873 implements MigrationInterface {
  name = 'CreateOwners1780159739873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "owners" (
        "id"          SERIAL NOT NULL,
        "firebaseUid" character varying(128) NOT NULL,
        "email"       character varying(255) NOT NULL,
        "name"        character varying(100) NOT NULL,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_3ef7a38bd659e2673f7e4c4dcc5" UNIQUE ("firebaseUid"),
        CONSTRAINT "UQ_df4ef717018c5dc7bd3f4ab0de5" UNIQUE ("email"),
        CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "owners"`);
  }
}
