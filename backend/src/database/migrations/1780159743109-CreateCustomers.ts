import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1780159743109 implements MigrationInterface {
  name = 'CreateCustomers1780159743109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id"          SERIAL NOT NULL,
        "firebaseUid" character varying(128) NOT NULL,
        "email"       character varying(255),
        "name"        character varying(100) NOT NULL,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_fe1bf87485ae4c620849415d287" UNIQUE ("firebaseUid"),
        CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "customers"`);
  }
}
