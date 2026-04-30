import type { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1777468866656 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create role table
		await queryRunner.query(`
            CREATE TABLE "public"."role" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(50) NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                "deleted_at" timestamp
            )
        `);

		// Create account table
		await queryRunner.query(`
            CREATE TABLE "public"."account" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar NOT NULL,
                "last_name" varchar NOT NULL,
                "email_address" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                "deleted_at" timestamp
            )
        `);

		// Create unique index on email_address
		await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_account_email_address" ON "account" ("email_address")
        `);

		// Create account_role table
		await queryRunner.query(`
            CREATE TABLE "public"."account_role" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "account_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                "deleted_at" timestamp,
                CONSTRAINT "FK_account_role_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_account_role_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE
            )
        `);

		// Create ticket table
		await queryRunner.query(`
            CREATE TABLE "public"."ticket" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar(255) NOT NULL,
                "description" text NOT NULL,
                "status" varchar(50) NOT NULL,
                "priority" varchar(50) NOT NULL,
                "assigned_to" uuid,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                "deleted_at" timestamp,
                CONSTRAINT "FK_ticket_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "account"("id") ON DELETE SET NULL
            )
        `);

		// Insert default roles
		await queryRunner.query(`
            INSERT INTO "role" ("name", "created_at", "updated_at")
            VALUES
                ('Admin', NOW(), NOW()),
                ('Technician', NOW(), NOW())
        `);

		// Insert admin user and assign Admin role
		await queryRunner.query(`
            WITH new_account AS (
                INSERT INTO "account" ("first_name", "last_name", "email_address", "password", "created_at", "updated_at")
                VALUES ('Admin', 'User', 'admin@admin.com', '$2b$10$oHuHsGw3QmH5giAK8wfWauIpowSaACY1eYGDfazdj70cGPChsaup6', NOW(), NOW())
                RETURNING "id"
            )
            INSERT INTO "account_role" ("account_id", "role_id", "created_at", "updated_at")
            SELECT new_account.id, role.id, NOW(), NOW()
            FROM new_account, role
            WHERE role.name = 'Admin'
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop tables in reverse order
		await queryRunner.query(`DROP TABLE IF EXISTS "public"."ticket"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "public"."account_role"`);
		await queryRunner.query(
			`DROP INDEX IF EXISTS "public"."IDX_account_email_address"`,
		);
		await queryRunner.query(`DROP TABLE IF EXISTS "public"."account"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "public"."role"`);
	}
}
