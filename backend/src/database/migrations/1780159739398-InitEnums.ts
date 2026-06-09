import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates all shared Postgres enum types idempotently.
 * Postgres has no `CREATE TYPE IF NOT EXISTS`, so each type is guarded with a
 * DO block that swallows `duplicate_object`. Centralising enums here avoids
 * the duplicate `CREATE TYPE plan_enum` that per-table generation emits.
 */
export class InitEnums1780159739398 implements MigrationInterface {
  name = 'InitEnums1780159739398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."plan_enum" AS ENUM('free', 'pro');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'annual');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."billing_provider_id" AS ENUM('mock', 'stripe');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."sub_status" AS ENUM('active', 'past_due', 'canceled', 'incomplete', 'trialing');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."bookings_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."invoice_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."sub_status"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."billing_provider_id"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."billing_cycle"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."plan_enum"`);
  }
}
