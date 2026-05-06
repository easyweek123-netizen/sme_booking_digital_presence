import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversations1777597908946 implements MigrationInterface {
  name = 'CreateConversations1777597908946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    if (dbType === 'mysql') {
      const alreadyApplied = await queryRunner.hasTable('conversation');
      if (alreadyApplied) return;

      await queryRunner.query(
        `CREATE TABLE \`conversation\` (
          \`id\`            int NOT NULL AUTO_INCREMENT,
          \`ownerId\`       int NOT NULL,
          \`title\`         varchar(80) NOT NULL,
          \`summary\`       TEXT NULL,
          \`lastMessageAt\` TIMESTAMP NULL,
          \`createdAt\`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`FK_conversation_ownerId\` FOREIGN KEY (\`ownerId\`)
            REFERENCES \`owners\`(\`id\`) ON DELETE CASCADE,
          PRIMARY KEY (\`id\`)
        )`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_conversation_owner_lastMessage\`
          ON \`conversation\` (\`ownerId\`, \`lastMessageAt\`)`,
      );

      await queryRunner.query(
        `CREATE TABLE \`message\` (
          \`id\`              int NOT NULL AUTO_INCREMENT,
          \`conversationId\`  int NOT NULL,
          \`role\`            varchar(16) NOT NULL,
          \`content\`         TEXT NOT NULL,
          \`toolCallsJson\`   TEXT NULL,
          \`toolCallId\`      varchar(64) NULL,
          \`createdAt\`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`FK_message_conversationId\` FOREIGN KEY (\`conversationId\`)
            REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE,
          PRIMARY KEY (\`id\`)
        )`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_message_conversation_createdAt\`
          ON \`message\` (\`conversationId\`, \`createdAt\`)`,
      );
      return;
    }

    // Postgres
    if (!(await queryRunner.hasTable('conversation'))) {
      await queryRunner.query(
        `CREATE TABLE "conversation" (
          "id"            SERIAL PRIMARY KEY,
          "ownerId"       int NOT NULL REFERENCES "owners"("id") ON DELETE CASCADE,
          "title"         varchar(80) NOT NULL,
          "summary"       text NULL,
          "lastMessageAt" TIMESTAMP NULL,
          "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_conversation_owner_lastMessage"
          ON "conversation" ("ownerId", "lastMessageAt" DESC);`,
      );
    }

    if (!(await queryRunner.hasTable('message'))) {
      await queryRunner.query(
        `CREATE TABLE "message" (
          "id"              SERIAL PRIMARY KEY,
          "conversationId"  int NOT NULL REFERENCES "conversation"("id") ON DELETE CASCADE,
          "role"            varchar(16) NOT NULL,
          "content"         text NOT NULL,
          "toolCallsJson"   text NULL,
          "toolCallId"      varchar(64) NULL,
          "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW()
        );`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_message_conversation_createdAt"
          ON "message" ("conversationId", "createdAt");`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('message'))
      await queryRunner.dropTable('message');
    if (await queryRunner.hasTable('conversation'))
      await queryRunner.dropTable('conversation');
  }
}
