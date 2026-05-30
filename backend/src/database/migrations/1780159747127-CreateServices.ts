import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServices1780159747127 implements MigrationInterface {
  name = 'CreateServices1780159747127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "services" (
        "id"                   SERIAL NOT NULL,
        "businessId"           integer NOT NULL,
        "categoryId"           integer,
        "schedule_id"          integer NOT NULL,
        "type"                 character varying(16) NOT NULL DEFAULT 'APPOINTMENT',
        "name"                 character varying(200) NOT NULL,
        "description"          text,
        "capacity"             integer NOT NULL DEFAULT 1,
        "durationMinutes"      integer NOT NULL,
        "pause_after_minutes"  integer NOT NULL DEFAULT 0,
        "price"                numeric(10,2),
        "price_type"           character varying(16) NOT NULL DEFAULT 'FIXED',
        "location_type"        character varying(16) NOT NULL DEFAULT 'AT_BUSINESS',
        "location_meta"        jsonb,
        "color"                character varying(7),
        "photo_url"            text,
        "isActive"             boolean NOT NULL DEFAULT true,
        "displayOrder"         integer NOT NULL DEFAULT 0,
        "createdAt"            TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"           TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"),
        CONSTRAINT "FK_4118d92267b796d8457ed4d6484"
          FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION,
        CONSTRAINT "FK_b6f9b3d2818d75f5839d70cbb18"
          FOREIGN KEY ("businessId") REFERENCES "business"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"
          FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "services"`);
  }
}
