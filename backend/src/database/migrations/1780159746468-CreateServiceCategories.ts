import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceCategories1780159746468 implements MigrationInterface {
  name = 'CreateServiceCategories1780159746468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "service_categories" (
        "id"           SERIAL NOT NULL,
        "businessId"   integer NOT NULL,
        "name"         character varying(100) NOT NULL,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fe4da5476c4ffe5aa2d3524ae68" PRIMARY KEY ("id"),
        CONSTRAINT "FK_f786ce65e2f44eca02bb369afcb"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "service_categories"`);
  }
}
