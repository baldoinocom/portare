/*
  Warnings:

  - You are about to drop the column `expired_at` on the `absent_drivers` table. All the data in the column will be lost.
  - You are about to drop the column `expired_at` on the `aso` table. All the data in the column will be lost.
  - You are about to drop the column `expired_at` on the `stopped_vehicles` table. All the data in the column will be lost.
  - The primary key for the `trailer_certificates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `semi_trailer_id` on the `trailer_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `trailer_certificates` table. All the data in the column will be lost.
  - Added the required column `expiration_type` to the `absent_drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `absent_drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiration_type` to the `aso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `aso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiration_type` to the `stopped_vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `stopped_vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiration_type` to the `trailer_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `trailer_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trailer_id` to the `trailer_certificates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExpirationType" AS ENUM ('quarterly', 'yearly');

-- DropForeignKey
ALTER TABLE "trailer_certificates" DROP CONSTRAINT "trailer_certificates_semi_trailer_id_fkey";

-- AlterTable
ALTER TABLE "absent_drivers" DROP COLUMN "expired_at",
ADD COLUMN     "expiration_type" "ExpirationType" NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "aso" DROP COLUMN "expired_at",
ADD COLUMN     "expiration_type" "ExpirationType" NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "groupings" ALTER COLUMN "semi_trailer_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stopped_vehicles" DROP COLUMN "expired_at",
ADD COLUMN     "expiration_type" "ExpirationType" NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "trailer_certificates" DROP CONSTRAINT "trailer_certificates_pkey",
DROP COLUMN "semi_trailer_id",
DROP COLUMN "type",
ADD COLUMN     "expiration_type" "ExpirationType" NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trailer_id" INTEGER NOT NULL,
ADD CONSTRAINT "trailer_certificates_pkey" PRIMARY KEY ("id", "trailer_id");

-- DropEnum
DROP TYPE "trailer_certificate_types";

-- AddForeignKey
ALTER TABLE "trailer_certificates" ADD CONSTRAINT "trailer_certificates_trailer_id_fkey" FOREIGN KEY ("trailer_id") REFERENCES "trailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
