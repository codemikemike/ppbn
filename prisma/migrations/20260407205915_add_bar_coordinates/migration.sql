/*
  Warnings:

  - You are about to alter the column `latitude` on the `bars` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Double`.
  - You are about to alter the column `longitude` on the `bars` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Double`.

*/
-- AlterTable
ALTER TABLE `bars` MODIFY `latitude` DOUBLE NULL,
    MODIFY `longitude` DOUBLE NULL;
