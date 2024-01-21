/*
  Warnings:

  - You are about to drop the column `expiration_type` on the `absent_drivers` table. All the data in the column will be lost.
  - You are about to drop the column `fleet_id` on the `aggregates` table. All the data in the column will be lost.
  - The primary key for the `logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fleet_id` on the `people` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_type` on the `stopped_vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `fleet_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `fleet_id` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the `fleets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cnh]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chassis]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ended_at` to the `absent_drivers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expiration_type` on the `aso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `code` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `group` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ended_at` to the `stopped_vehicles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expiration_type` on the `trailer_certificates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "permission_code" AS ENUM ('view', 'create', 'update', 'delete', 'menu');

-- CreateEnum
CREATE TYPE "permission_group" AS ENUM ('groups', 'permissions', 'roles', 'trips', 'groupings', 'drivers', 'aggregates', 'units', 'clients', 'trucks', 'trailers');

-- CreateEnum
CREATE TYPE "expiration_type" AS ENUM ('quarterly', 'yearly');

-- DropForeignKey
ALTER TABLE "aggregates" DROP CONSTRAINT "aggregates_fleet_id_fkey";

-- DropForeignKey
ALTER TABLE "fleets" DROP CONSTRAINT "fleets_company_id_fkey";

-- DropForeignKey
ALTER TABLE "people" DROP CONSTRAINT "people_fleet_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_fleet_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_fleet_id_fkey";

-- DropIndex
DROP INDEX "aggregates_fleet_id_idx";

-- DropIndex
DROP INDEX "people_fleet_id_idx";

-- DropIndex
DROP INDEX "trips_fleet_id_idx";

-- DropIndex
DROP INDEX "vehicles_fleet_id_idx";

-- AlterTable
ALTER TABLE "absent_drivers" DROP COLUMN "expiration_type",
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "aggregates" DROP COLUMN "fleet_id",
ADD COLUMN     "unit_id" INTEGER;

-- AlterTable
ALTER TABLE "aso" DROP COLUMN "expiration_type",
ADD COLUMN     "expiration_type" "expiration_type" NOT NULL;

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "cnh" VARCHAR(11);

-- AlterTable
ALTER TABLE "logs" DROP CONSTRAINT "logs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "people" DROP COLUMN "fleet_id",
ADD COLUMN     "unit_id" INTEGER;

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "code",
ADD COLUMN     "code" "permission_code" NOT NULL,
DROP COLUMN "group",
ADD COLUMN     "group" "permission_group" NOT NULL;

-- AlterTable
ALTER TABLE "stopped_vehicles" DROP COLUMN "expiration_type",
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "trailer_certificates" DROP COLUMN "expiration_type",
ADD COLUMN     "expiration_type" "expiration_type" NOT NULL;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "fleet_id",
ADD COLUMN     "unit_id" INTEGER;

-- AlterTable
ALTER TABLE "trucks" ADD COLUMN     "compressor" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "fleet_id",
ADD COLUMN     "axle" INTEGER,
ADD COLUMN     "chassis" VARCHAR(17),
ADD COLUMN     "unit_id" INTEGER,
ADD COLUMN     "year" VARCHAR(4);

-- DropTable
DROP TABLE "fleets";

-- DropEnum
DROP TYPE "ExpirationType";

-- DropEnum
DROP TYPE "PermissionCode";

-- DropEnum
DROP TYPE "PermissionGroup";

-- CreateTable
CREATE TABLE "units" (
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("company_id")
);

-- CreateIndex
CREATE INDEX "aggregates_unit_id_idx" ON "aggregates"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_cnh_key" ON "drivers"("cnh");

-- CreateIndex
CREATE INDEX "people_unit_id_idx" ON "people"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_group_key" ON "permissions"("code", "group");

-- CreateIndex
CREATE INDEX "trips_unit_id_idx" ON "trips"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_chassis_key" ON "vehicles"("chassis");

-- CreateIndex
CREATE INDEX "vehicles_unit_id_idx" ON "vehicles"("unit_id");

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;
