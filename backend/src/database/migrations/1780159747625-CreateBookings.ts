import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookings1780159747625 implements MigrationInterface {
  name = 'CreateBookings1780159747625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id"            SERIAL NOT NULL,
        "reference"     character varying(10) NOT NULL,
        "serviceId"     integer NOT NULL,
        "customerName"  character varying(100) NOT NULL,
        "customerEmail" character varying(255) NOT NULL,
        "customerId"    integer NOT NULL,
        "date"          date NOT NULL,
        "startTime"     TIME NOT NULL,
        "endTime"       TIME NOT NULL,
        "notes"         text,
        "status"        "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING',
        "confirmedAt"   TIMESTAMP,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_d7eca65f0a4d442ec4491f2f804" UNIQUE ("reference"),
        CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"),
        CONSTRAINT "FK_15a2431ec10d29dcd96c9563b65"
          FOREIGN KEY ("serviceId") REFERENCES "services"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f"
          FOREIGN KEY ("customerId") REFERENCES "customers"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bookings"`);
  }
}
