import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessage1780159749970 implements MigrationInterface {
  name = 'CreateMessage1780159749970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "message" (
        "id"             SERIAL NOT NULL,
        "conversationId" integer NOT NULL,
        "role"           character varying(16) NOT NULL,
        "content"        text NOT NULL,
        "toolCallsJson"  text,
        "suggestions"    text,
        "toolCallId"     character varying(64),
        "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"),
        CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"
          FOREIGN KEY ("conversationId") REFERENCES "conversation"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_message_conversation_createdAt"
        ON "message" ("conversationId", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_message_conversation_createdAt"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "message"`);
  }
}
