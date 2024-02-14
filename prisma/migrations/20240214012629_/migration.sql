-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('create', 'update', 'delete');

-- CreateEnum
CREATE TYPE "permission_code" AS ENUM ('view', 'create', 'update', 'delete', 'menu');

-- CreateEnum
CREATE TYPE "permission_group" AS ENUM ('groups', 'permissions', 'roles', 'trips', 'groupings', 'drivers', 'aggregates', 'units', 'clients', 'trucks', 'trailers');

-- CreateEnum
CREATE TYPE "driver_status" AS ENUM ('leave_of_absence', 'medical_certificate', 'break', 'vacation');

-- CreateEnum
CREATE TYPE "company_type" AS ENUM ('cnpj', 'cpf');

-- CreateEnum
CREATE TYPE "client_type" AS ENUM ('both', 'origin', 'destination');

-- CreateEnum
CREATE TYPE "vehicle_status" AS ENUM ('maintenance', 'documentation');

-- CreateEnum
CREATE TYPE "expiration_type" AS ENUM ('quarterly', 'yearly');

-- CreateEnum
CREATE TYPE "trip_status" AS ENUM ('scheduled', 'loaded', 'departure', 'terminal', 'unloaded', 'finished', 'canceled');

-- CreateEnum
CREATE TYPE "ticket_action" AS ENUM ('maintenance_request');

-- CreateEnum
CREATE TYPE "ticket_reaction" AS ENUM ('pending', 'accepted', 'denied');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('server', 'ticket', 'ticket_answered');

-- CreateTable
CREATE TABLE "logs" (
    "id" BIGSERIAL NOT NULL,
    "action" "action_type" NOT NULL,
    "model" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "external_user_id" TEXT NOT NULL,
    "person_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" "permission_code" NOT NULL,
    "group" "permission_group" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "document" VARCHAR(11),
    "phone_number" VARCHAR(11),
    "unit_id" INTEGER,
    "aggregate_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "person_id" INTEGER NOT NULL,
    "cnh" VARCHAR(11),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "aso" (
    "id" SERIAL NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "expiration_type" "expiration_type" NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aso_pkey" PRIMARY KEY ("id","driver_id")
);

-- CreateTable
CREATE TABLE "absent_drivers" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "status" "driver_status" NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absent_drivers_pkey" PRIMARY KEY ("id","driver_id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trade_name" TEXT,
    "document" VARCHAR(14),
    "type" "company_type" NOT NULL DEFAULT 'cnpj',
    "address_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "company_id" INTEGER NOT NULL,
    "type" "client_type" NOT NULL DEFAULT 'both',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "units" (
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "aggregates" (
    "company_id" INTEGER NOT NULL,
    "unit_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aggregates_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "zip_code" TEXT,
    "state" TEXT,
    "city" TEXT,
    "locale" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "licensePlate" VARCHAR(10) NOT NULL,
    "model" TEXT,
    "year" TEXT,
    "axle" INTEGER,
    "chassis" VARCHAR(17),
    "renavam" VARCHAR(11),
    "brand_id" INTEGER,
    "unit_id" INTEGER,
    "aggregate_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stopped_vehicles" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "status" "vehicle_status" NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stopped_vehicles_pkey" PRIMARY KEY ("id","vehicle_id")
);

-- CreateTable
CREATE TABLE "trucks" (
    "id" SERIAL NOT NULL,
    "compressor" BOOLEAN NOT NULL DEFAULT false,
    "vehicle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semi_trailers" (
    "id" SERIAL NOT NULL,
    "configuration_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semi_trailers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trailers" (
    "id" SERIAL NOT NULL,
    "fleetNumber" TEXT,
    "vehicle_id" INTEGER NOT NULL,
    "semi_trailer_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trailers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trailer_configurations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number_of_trailers" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trailer_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trailer_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trailer_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trailer_certificates" (
    "id" SERIAL NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "expiration_type" "expiration_type" NOT NULL,
    "trailer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trailer_certificates_pkey" PRIMARY KEY ("id","trailer_id")
);

-- CreateTable
CREATE TABLE "groupings" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER,
    "truck_id" INTEGER,
    "semi_trailer_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groupings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "order" TEXT,
    "note" TEXT,
    "departed_at" TIMESTAMP(3),
    "arrived_at" TIMESTAMP(3),
    "status" "trip_status" NOT NULL DEFAULT 'scheduled',
    "origin_id" INTEGER,
    "destination_id" INTEGER,
    "driver_id" INTEGER,
    "truck_id" INTEGER,
    "semi_trailer_id" INTEGER,
    "cargo_id" INTEGER,
    "unit_id" INTEGER,
    "aggregate_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "action" "ticket_action" NOT NULL,
    "reaction" "ticket_reaction" NOT NULL DEFAULT 'pending',
    "requester_id" INTEGER NOT NULL,
    "acceptor_id" INTEGER,
    "vehicle_id" INTEGER,
    "trip_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "read_at" TIMESTAMP(3),
    "type" "notification_type" NOT NULL,
    "ticket_id" TEXT,
    "recipient_id" INTEGER NOT NULL,
    "sender_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mdfe" (
    "id" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "branch" TEXT,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mdfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserGroup" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RolePermission" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SemiTrailerCargo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_external_user_id_key" ON "users"("external_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_person_id_key" ON "users"("person_id");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_external_user_id_idx" ON "users"("external_user_id");

-- CreateIndex
CREATE INDEX "users_person_id_idx" ON "users"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_group_key" ON "permissions"("code", "group");

-- CreateIndex
CREATE UNIQUE INDEX "people_document_key" ON "people"("document");

-- CreateIndex
CREATE INDEX "people_name_idx" ON "people"("name");

-- CreateIndex
CREATE INDEX "people_nickname_idx" ON "people"("nickname");

-- CreateIndex
CREATE INDEX "people_document_idx" ON "people"("document");

-- CreateIndex
CREATE INDEX "people_unit_id_idx" ON "people"("unit_id");

-- CreateIndex
CREATE INDEX "people_aggregate_id_idx" ON "people"("aggregate_id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_cnh_key" ON "drivers"("cnh");

-- CreateIndex
CREATE INDEX "absent_drivers_status_idx" ON "absent_drivers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "companies_document_key" ON "companies"("document");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_trade_name_idx" ON "companies"("trade_name");

-- CreateIndex
CREATE INDEX "companies_document_idx" ON "companies"("document");

-- CreateIndex
CREATE INDEX "companies_type_idx" ON "companies"("type");

-- CreateIndex
CREATE INDEX "clients_type_idx" ON "clients"("type");

-- CreateIndex
CREATE INDEX "aggregates_company_id_idx" ON "aggregates"("company_id");

-- CreateIndex
CREATE INDEX "aggregates_unit_id_idx" ON "aggregates"("unit_id");

-- CreateIndex
CREATE INDEX "addresses_zip_code_idx" ON "addresses"("zip_code");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licensePlate_key" ON "vehicles"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_chassis_key" ON "vehicles"("chassis");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_renavam_key" ON "vehicles"("renavam");

-- CreateIndex
CREATE INDEX "vehicles_brand_id_idx" ON "vehicles"("brand_id");

-- CreateIndex
CREATE INDEX "vehicles_unit_id_idx" ON "vehicles"("unit_id");

-- CreateIndex
CREATE INDEX "vehicles_aggregate_id_idx" ON "vehicles"("aggregate_id");

-- CreateIndex
CREATE UNIQUE INDEX "trucks_vehicle_id_key" ON "trucks"("vehicle_id");

-- CreateIndex
CREATE INDEX "semi_trailers_configuration_id_idx" ON "semi_trailers"("configuration_id");

-- CreateIndex
CREATE INDEX "semi_trailers_type_id_idx" ON "semi_trailers"("type_id");

-- CreateIndex
CREATE UNIQUE INDEX "trailers_fleetNumber_key" ON "trailers"("fleetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "trailers_vehicle_id_key" ON "trailers"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "trailer_configurations_name_key" ON "trailer_configurations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "trailer_types_name_key" ON "trailer_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cargos_name_key" ON "cargos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "groupings_driver_id_truck_id_semi_trailer_id_key" ON "groupings"("driver_id", "truck_id", "semi_trailer_id");

-- CreateIndex
CREATE INDEX "trips_draft_idx" ON "trips"("draft");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_origin_id_idx" ON "trips"("origin_id");

-- CreateIndex
CREATE INDEX "trips_destination_id_idx" ON "trips"("destination_id");

-- CreateIndex
CREATE INDEX "trips_driver_id_idx" ON "trips"("driver_id");

-- CreateIndex
CREATE INDEX "trips_truck_id_idx" ON "trips"("truck_id");

-- CreateIndex
CREATE INDEX "trips_semi_trailer_id_idx" ON "trips"("semi_trailer_id");

-- CreateIndex
CREATE INDEX "trips_cargo_id_idx" ON "trips"("cargo_id");

-- CreateIndex
CREATE INDEX "trips_unit_id_idx" ON "trips"("unit_id");

-- CreateIndex
CREATE INDEX "trips_aggregate_id_idx" ON "trips"("aggregate_id");

-- CreateIndex
CREATE INDEX "tickets_requester_id_idx" ON "tickets"("requester_id");

-- CreateIndex
CREATE INDEX "tickets_acceptor_id_idx" ON "tickets"("acceptor_id");

-- CreateIndex
CREATE INDEX "tickets_vehicle_id_idx" ON "tickets"("vehicle_id");

-- CreateIndex
CREATE INDEX "tickets_trip_id_idx" ON "tickets"("trip_id");

-- CreateIndex
CREATE INDEX "notifications_ticket_id_idx" ON "notifications"("ticket_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_idx" ON "notifications"("recipient_id");

-- CreateIndex
CREATE INDEX "notifications_sender_id_idx" ON "notifications"("sender_id");

-- CreateIndex
CREATE INDEX "mdfe_branch_idx" ON "mdfe"("branch");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupRole_AB_unique" ON "_GroupRole"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupRole_B_index" ON "_GroupRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserGroup_AB_unique" ON "_UserGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_UserGroup_B_index" ON "_UserGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RolePermission_AB_unique" ON "_RolePermission"("A", "B");

-- CreateIndex
CREATE INDEX "_RolePermission_B_index" ON "_RolePermission"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SemiTrailerCargo_AB_unique" ON "_SemiTrailerCargo"("A", "B");

-- CreateIndex
CREATE INDEX "_SemiTrailerCargo_B_index" ON "_SemiTrailerCargo"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "aggregates"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aso" ADD CONSTRAINT "aso_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absent_drivers" ADD CONSTRAINT "absent_drivers_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "aggregates"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stopped_vehicles" ADD CONSTRAINT "stopped_vehicles_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semi_trailers" ADD CONSTRAINT "semi_trailers_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "trailer_configurations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semi_trailers" ADD CONSTRAINT "semi_trailers_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "trailer_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trailers" ADD CONSTRAINT "trailers_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trailers" ADD CONSTRAINT "semi_trailer" FOREIGN KEY ("semi_trailer_id") REFERENCES "semi_trailers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trailer_certificates" ADD CONSTRAINT "trailer_certificates_trailer_id_fkey" FOREIGN KEY ("trailer_id") REFERENCES "trailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupings" ADD CONSTRAINT "groupings_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupings" ADD CONSTRAINT "groupings_truck_id_fkey" FOREIGN KEY ("truck_id") REFERENCES "trucks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupings" ADD CONSTRAINT "groupings_semi_trailer_id_fkey" FOREIGN KEY ("semi_trailer_id") REFERENCES "semi_trailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "origin_company" FOREIGN KEY ("origin_id") REFERENCES "clients"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "destination_company" FOREIGN KEY ("destination_id") REFERENCES "clients"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("person_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_truck_id_fkey" FOREIGN KEY ("truck_id") REFERENCES "trucks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_semi_trailer_id_fkey" FOREIGN KEY ("semi_trailer_id") REFERENCES "semi_trailers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "aggregates"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "ticket_requester" FOREIGN KEY ("requester_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "ticket_acceptor" FOREIGN KEY ("acceptor_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notification_recipient" FOREIGN KEY ("recipient_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notification_sender" FOREIGN KEY ("sender_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupRole" ADD CONSTRAINT "_GroupRole_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupRole" ADD CONSTRAINT "_GroupRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroup" ADD CONSTRAINT "_UserGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroup" ADD CONSTRAINT "_UserGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermission" ADD CONSTRAINT "_RolePermission_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermission" ADD CONSTRAINT "_RolePermission_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SemiTrailerCargo" ADD CONSTRAINT "_SemiTrailerCargo_A_fkey" FOREIGN KEY ("A") REFERENCES "cargos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SemiTrailerCargo" ADD CONSTRAINT "_SemiTrailerCargo_B_fkey" FOREIGN KEY ("B") REFERENCES "semi_trailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
