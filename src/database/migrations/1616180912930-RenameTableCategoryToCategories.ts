import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTableCategoryToCategories1616180912930
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('category', 'categories');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('categories', 'category');
  }
}
