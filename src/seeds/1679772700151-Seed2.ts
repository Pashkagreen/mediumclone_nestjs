import {MigrationInterface, QueryRunner} from "typeorm";

export class Seed2_1679772700151 implements MigrationInterface {
    name = 'Seed2_1679772700151'

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`INSERT INTO tags (name) VALUES ('html'), ('js'), ('node')`)
       await queryRunner.query(`INSERT INTO users (username, email, password) VALUES ('Alex', 'a@h.com', '$2b$10$H54Gx5ozKJorUwMflDv13.90oOBcMYCNH88BMejNG03ySRW8VR3Dm')`)
       await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('seed', 'seedTitle', 'seedDesc', 'seedBody', 'dragons,tea', 1)`)
    }

    public async down(): Promise<void> {
    }

}
