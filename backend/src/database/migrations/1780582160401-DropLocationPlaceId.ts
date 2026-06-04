import { MigrationInterface, QueryRunner } from "typeorm";

export class DropLocationPlaceId1780582160401 implements MigrationInterface {
    name = 'DropLocationPlaceId1780582160401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN IF EXISTS "placeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" ADD COLUMN "placeId" character varying(80)`);
    }

}
