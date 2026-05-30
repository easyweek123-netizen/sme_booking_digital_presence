import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBusinessTypes1780159740980 implements MigrationInterface {
  name = 'CreateBusinessTypes1780159740980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "business_types" (
        "id"         SERIAL NOT NULL,
        "categoryId" integer NOT NULL,
        "slug"       character varying(50) NOT NULL,
        "name"       character varying(100) NOT NULL,
        "isActive"   boolean NOT NULL DEFAULT true,
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_2ca4e4113e4d80a07d57be266a4" UNIQUE ("slug"),
        CONSTRAINT "PK_3c34c2b0b96fd7d13d7b4750b27" PRIMARY KEY ("id"),
        CONSTRAINT "FK_75323dddd47900374efe477327e"
          FOREIGN KEY ("categoryId") REFERENCES "business_categories"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "business_types"`);
  }
}
