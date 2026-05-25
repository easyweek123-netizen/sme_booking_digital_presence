import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropBookingBusinessId1778600500000 implements MigrationInterface {
  name = 'DropBookingBusinessId1778600500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      const fkRows = (await queryRunner.query(
        `SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings'
           AND COLUMN_NAME = 'businessId' AND REFERENCED_TABLE_NAME = 'businesses'
         LIMIT 1`,
      )) as { CONSTRAINT_NAME: string }[];
      if (fkRows.length > 0) {
        await queryRunner.query(
          `ALTER TABLE bookings DROP FOREIGN KEY ${fkRows[0].CONSTRAINT_NAME}`,
        );
      }
      await queryRunner.query(`ALTER TABLE bookings DROP COLUMN businessId`);
    } else {
      await queryRunner.query(
        `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "businessId" CASCADE`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE bookings ADD COLUMN businessId INT NOT NULL DEFAULT 0`,
      );
      await queryRunner.query(
        `UPDATE bookings b JOIN services s ON b.serviceId = s.id SET b.businessId = s.businessId`,
      );
      await queryRunner.query(
        `ALTER TABLE bookings ADD CONSTRAINT FK_bookings_businessId
         FOREIGN KEY (businessId) REFERENCES business(id)`,
      );
    } else {
      await queryRunner.query(
        `ALTER TABLE "bookings" ADD COLUMN "businessId" INT NOT NULL DEFAULT 0`,
      );
      await queryRunner.query(
        `UPDATE "bookings" b SET "businessId" = s."businessId"
         FROM "services" s WHERE b."serviceId" = s.id`,
      );
      await queryRunner.query(
        `ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_businessId"
         FOREIGN KEY ("businessId") REFERENCES "business"("id")`,
      );
      await queryRunner.query(
        `ALTER TABLE "bookings" ALTER COLUMN "businessId" DROP DEFAULT`,
      );
    }
  }
}
