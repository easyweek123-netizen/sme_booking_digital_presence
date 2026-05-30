import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBusinessCategories1780159740444 implements MigrationInterface {
  name = 'CreateBusinessCategories1780159740444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "business_categories" (
        "id"       SERIAL NOT NULL,
        "slug"     character varying(50) NOT NULL,
        "name"     character varying(100) NOT NULL,
        "icon"     character varying(50) NOT NULL,
        "color"    character varying(20) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_88e8da0639f9fee09941cd8d826" UNIQUE ("slug"),
        CONSTRAINT "PK_d10a707dfd0ca189233999204e5" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "business_categories"`);
  }
}
