import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCardsToMessage1781562774048 implements MigrationInterface {
  name = 'AddCardsToMessage1781562774048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "cards" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "cards"`);
  }
}
