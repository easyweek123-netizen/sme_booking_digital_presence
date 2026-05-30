import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoice1780159744322 implements MigrationInterface {
  name = 'CreateInvoice1780159744322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "invoice" (
        "id"                SERIAL NOT NULL,
        "subscriptionId"    integer NOT NULL,
        "providerInvoiceId" character varying(120) NOT NULL,
        "amountCents"       integer NOT NULL,
        "currency"          character varying(3) NOT NULL,
        "status"            "public"."invoice_status" NOT NULL,
        "periodStart"       TIMESTAMP NOT NULL,
        "periodEnd"         TIMESTAMP NOT NULL,
        "paidAt"            TIMESTAMP,
        "hostedUrl"         character varying(500),
        "createdAt"         TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_806933cd8e6664ebccfcfb9fd61" UNIQUE ("providerInvoiceId"),
        CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca"
          FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_invoice_subscription_createdAt"
        ON "invoice" ("subscriptionId", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_invoice_subscription_createdAt"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice"`);
  }
}
