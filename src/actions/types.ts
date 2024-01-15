import { Prisma } from '@prisma/client'

const DriverReturnType = Prisma.validator<Prisma.DriverDefaultArgs>()({
  include: { person: true },
})

const AggregateReturnType = Prisma.validator<Prisma.AggregateDefaultArgs>()({
  include: { company: true, person: true },
})

const ClientReturnType = Prisma.validator<Prisma.ClientDefaultArgs>()({
  include: { company: true },
})

const FleetReturnType = Prisma.validator<Prisma.FleetDefaultArgs>()({
  include: { company: true },
})

const VehicleReturnType = Prisma.validator<Prisma.VehicleDefaultArgs>()({
  include: { brand: true },
})

const SemiTrailerReturnType = Prisma.validator<Prisma.SemiTrailerDefaultArgs>()(
  {
    include: {
      type: true,
      cargos: true,
      configuration: true,
      trailers: {
        include: { vehicle: { include: { brand: true, fleet: true } } },
      },
    },
  },
)

const TruckReturnType = Prisma.validator<Prisma.TruckDefaultArgs>()({
  include: { vehicle: { include: { brand: true } } },
})

const StoppedVehicleReturnType =
  Prisma.validator<Prisma.StoppedVehicleDefaultArgs>()({
    include: { vehicle: { include: { brand: true } } },
  })

export type Driver = Prisma.DriverGetPayload<typeof DriverReturnType>

export type Aggregate = Prisma.AggregateGetPayload<typeof AggregateReturnType>

export type Client = Prisma.ClientGetPayload<typeof ClientReturnType>

export type Fleet = Prisma.FleetGetPayload<typeof FleetReturnType>

export type Vehicle = Prisma.VehicleGetPayload<typeof VehicleReturnType>

export type SemiTrailer = Prisma.SemiTrailerGetPayload<
  typeof SemiTrailerReturnType
>

export type Truck = Prisma.TruckGetPayload<typeof TruckReturnType>

export type StoppedVehicle = Prisma.StoppedVehicleGetPayload<
  typeof StoppedVehicleReturnType
>
