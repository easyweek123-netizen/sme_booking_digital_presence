import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInquiries1780159748611 implements MigrationInterface {
  name = 'CreateInquiries1780159748611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inquiries" (
        "id"         SERIAL NOT NULL,
        "name"       character varying(120) NOT NULL,
        "email"      character varying(255) NOT NULL,
        "company"    character varying(255),
        "budget"     character varying(50) NOT NULL,
        "message"    text NOT NULL,
        "source"     character varying(50) NOT NULL DEFAULT 'services_page',
        "service_id" integer,
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ceacaa439988b25eb9459e694d9" PRIMARY KEY ("id"),
        CONSTRAINT "FK_a0f2872a681b18d55cabb1e176f"
          FOREIGN KEY ("service_id") REFERENCES "services"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "inquiries"`);
  }
}
