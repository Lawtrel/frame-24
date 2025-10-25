/*
  Warnings:

  - Added the required column `company_id` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_profiles` ADD COLUMN `company_id` BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX `company_id` ON `user_profiles`(`company_id`);

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
