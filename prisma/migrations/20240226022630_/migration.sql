/*
  Warnings:

  - The values [groups,permissions,roles,trips,groupings,drivers,aggregates,units,clients,trucks,trailers] on the enum `permission_group` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[cnhRegistry]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "permission_group_new" AS ENUM ('group', 'permission', 'role', 'trip', 'grouping', 'driver', 'aggregate', 'client', 'unit', 'truck', 'semiTrailer', 'brand');
ALTER TABLE "permissions" ALTER COLUMN "group" TYPE "permission_group_new" USING ("group"::text::"permission_group_new");
ALTER TYPE "permission_group" RENAME TO "permission_group_old";
ALTER TYPE "permission_group_new" RENAME TO "permission_group";
DROP TYPE "permission_group_old";
COMMIT;

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "cnhRegistry" VARCHAR(11);

-- AlterTable
ALTER TABLE "trucks" ADD COLUMN     "compressor_model" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "drivers_cnhRegistry_key" ON "drivers"("cnhRegistry");
