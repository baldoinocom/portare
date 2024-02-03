/*
  Warnings:

  - A unique constraint covering the columns `[vehicle_id]` on the table `trailers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id]` on the table `trucks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "trailers_vehicle_id_key" ON "trailers"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "trucks_vehicle_id_key" ON "trucks"("vehicle_id");
