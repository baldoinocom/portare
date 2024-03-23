/*
  Warnings:

  - The values [menu] on the enum `permission_code` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[group,code,guard]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guard` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "permission_guard" AS ENUM ('action', 'page', 'component');

-- AlterEnum
BEGIN;
CREATE TYPE "permission_code_new" AS ENUM ('list', 'view', 'create', 'update', 'delete', 'import', 'navigate', 'update_status');
ALTER TABLE "permissions" ALTER COLUMN "code" TYPE "permission_code_new" USING ("code"::text::"permission_code_new");
ALTER TYPE "permission_code" RENAME TO "permission_code_old";
ALTER TYPE "permission_code_new" RENAME TO "permission_code";
DROP TYPE "permission_code_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "permission_group" ADD VALUE 'user';
ALTER TYPE "permission_group" ADD VALUE 'aso';
ALTER TYPE "permission_group" ADD VALUE 'absentDriver';
ALTER TYPE "permission_group" ADD VALUE 'trailer_configuration';
ALTER TYPE "permission_group" ADD VALUE 'trailer_type';
ALTER TYPE "permission_group" ADD VALUE 'cargo';
ALTER TYPE "permission_group" ADD VALUE 'trailer_certificate';
ALTER TYPE "permission_group" ADD VALUE 'stopped_vehicle';
ALTER TYPE "permission_group" ADD VALUE 'mdfe';

-- DropIndex
DROP INDEX "permissions_code_group_key";

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "guard" "permission_guard" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_group_code_guard_key" ON "permissions"("group", "code", "guard");
