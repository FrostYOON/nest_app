import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocial1742460226157 implements MigrationInterface {
  name = 'AddSocial1742460226157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socialId" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_registertype_enum" AS ENUM('common', 'google', 'kakao', 'apple', 'naver')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "registerType" "public"."user_registertype_enum" NOT NULL DEFAULT 'common'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
    await queryRunner.query(`DROP TYPE "public"."user_registertype_enum"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
  }
}
