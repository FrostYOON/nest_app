import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostViewMigration1741337363113 implements MigrationInterface {
  name = 'AddPostViewMigration1741337363113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deletedAt" TIMESTAMP, "userId" uuid, "postId" uuid, CONSTRAINT "PK_89a020aa096a078dc6f602ffe20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "thumbnailUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "viewCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_view" ADD CONSTRAINT "FK_29ab73695903a3b0f2fbaa27a82" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_view" ADD CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_view" DROP CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_view" DROP CONSTRAINT "FK_29ab73695903a3b0f2fbaa27a82"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "viewCount"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnailUrl"`);
    await queryRunner.query(`DROP TABLE "post_view"`);
  }
}
