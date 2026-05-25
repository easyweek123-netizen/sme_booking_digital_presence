import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInquiryServiceId1778600200000 implements MigrationInterface {
  name = 'AddInquiryServiceId1778600200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(`
        ALTER TABLE inquiries
        ADD COLUMN service_id INT NULL,
        ADD CONSTRAINT fk_inquiry_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
      `);
    } else {
      await queryRunner.query(
        `ALTER TABLE "inquiries" ADD COLUMN "service_id" INT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "inquiries" ADD CONSTRAINT "fk_inquiry_service" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isMysql = queryRunner.connection.options.type === 'mysql';
    if (isMysql) {
      await queryRunner.query(
        `ALTER TABLE inquiries DROP FOREIGN KEY fk_inquiry_service`,
      );
      await queryRunner.query(`ALTER TABLE inquiries DROP COLUMN service_id`);
    } else {
      await queryRunner.query(
        `ALTER TABLE "inquiries" DROP CONSTRAINT IF EXISTS "fk_inquiry_service"`,
      );
      await queryRunner.query(
        `ALTER TABLE "inquiries" DROP COLUMN "service_id"`,
      );
    }
  }
}
