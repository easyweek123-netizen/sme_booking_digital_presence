import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeedback1780159749055 implements MigrationInterface {
  name = 'CreateFeedback1780159749055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "feedback" (
        "id"        SERIAL NOT NULL,
        "email"     character varying(255) NOT NULL,
        "message"   text NOT NULL,
        "source"    character varying(50) NOT NULL DEFAULT 'pricing_page',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "feedback"`);
  }
}
