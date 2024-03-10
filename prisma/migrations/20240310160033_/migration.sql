/*
  Warnings:

  - You are about to drop the column `cnhRegistry` on the `drivers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnh_mirror]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "drivers_cnhRegistry_key";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "cnhRegistry",
ADD COLUMN     "cnh_mirror" VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "drivers_cnh_mirror_key" ON "drivers"("cnh_mirror");
