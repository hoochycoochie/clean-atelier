import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPlayerTable1743955772059 implements MigrationInterface {
  name = 'InitPlayerTable1743955772059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "shortname" character varying NOT NULL, "country" json NOT NULL, "picture" character varying NOT NULL, "data" json NOT NULL, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "player"`);
  }
}
