import { MigrationInterface, QueryRunner } from "typeorm";

export class SetBusinessShowWeeklyHoursDefaultFalse1782261313331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasBusinessTable = await queryRunner.hasTable('business');
        if (!hasBusinessTable) return;
        const hasColumn = await queryRunner.hasColumn('business', 'show_weekly_hours');
        
        if (!hasColumn) return;
        await queryRunner.query(`
            ALTER TABLE "business"
            ALTER COLUMN "show_weekly_hours" SET DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasBusinessTable = await queryRunner.hasTable('business');
        if (!hasBusinessTable) return;
        const hasColumn = await queryRunner.hasColumn('business', 'show_weekly_hours');
        if (!hasColumn) return;
        
        await queryRunner.query(`
          ALTER TABLE "business"
          ALTER COLUMN "show_weekly_hours" SET DEFAULT true
        `);
    }

}
