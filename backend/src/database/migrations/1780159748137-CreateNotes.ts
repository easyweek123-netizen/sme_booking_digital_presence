import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotes1780159748137 implements MigrationInterface {
  name = 'CreateNotes1780159748137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notes" (
        "id"         SERIAL NOT NULL,
        "content"    text NOT NULL,
        "customerId" integer,
        "bookingId"  integer,
        "ownerId"    integer NOT NULL,
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"),
        CONSTRAINT "FK_4460436433cdc2ba5574b0723c5"
          FOREIGN KEY ("customerId") REFERENCES "customers"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_3ec7def612a059e04ac47ebaa70"
          FOREIGN KEY ("bookingId") REFERENCES "bookings"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_8fcc29811c424b531ac9a341d29"
          FOREIGN KEY ("ownerId") REFERENCES "owners"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notes"`);
  }
}
