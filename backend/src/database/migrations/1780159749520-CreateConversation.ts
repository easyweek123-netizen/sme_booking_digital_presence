import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversation1780159749520 implements MigrationInterface {
  name = 'CreateConversation1780159749520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "conversation" (
        "id"            SERIAL NOT NULL,
        "ownerId"       integer NOT NULL,
        "title"         character varying(80) NOT NULL,
        "summary"       text,
        "lastMessageAt" TIMESTAMP,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"),
        CONSTRAINT "FK_370aed8457add6193a28a807e2e"
          FOREIGN KEY ("ownerId") REFERENCES "owners"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_conversation_owner_lastMessage"
        ON "conversation" ("ownerId", "lastMessageAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_conversation_owner_lastMessage"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "conversation"`);
  }
}
