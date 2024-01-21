import { Prisma } from '@prisma/client'

const DriverReturnType = Prisma.validator<Prisma.DriverDefaultArgs>()({
  include: { person: true },
})

const ASOReturnType = Prisma.validator<Prisma.ASODefaultArgs>()({
  include: { driver: { include: { person: true } } },
})

const AbsentDriverReturnType =
  Prisma.validator<Prisma.AbsentDriverDefaultArgs>()({
    include: { driver: { include: { person: true } } },
  })

const AggregateReturnType = Prisma.validator<Prisma.AggregateDefaultArgs>()({
  include: { company: true, person: true },
})

const ClientReturnType = Prisma.validator<Prisma.ClientDefaultArgs>()({
  include: { company: true },
})

const UnitReturnType = Prisma.validator<Prisma.UnitDefaultArgs>()({
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
        include: { vehicle: { include: { brand: true, unit: true } } },
      },
    },
  },
)

const TrailerReturnType = Prisma.validator<Prisma.TrailerDefaultArgs>()({
  include: { vehicle: { include: { brand: true } } },
})

const TrailerCertificateReturnType =
  Prisma.validator<Prisma.TrailerCertificateDefaultArgs>()({
    include: {
      trailer: { include: { vehicle: { include: { brand: true } } } },
    },
  })

const TruckReturnType = Prisma.validator<Prisma.TruckDefaultArgs>()({
  include: { vehicle: { include: { brand: true } } },
})

const StoppedVehicleReturnType =
  Prisma.validator<Prisma.StoppedVehicleDefaultArgs>()({
    include: { vehicle: { include: { brand: true } } },
  })

export type Driver = Prisma.DriverGetPayload<typeof DriverReturnType>

export type ASO = Prisma.ASOGetPayload<typeof ASOReturnType>

export type AbsentDriver = Prisma.AbsentDriverGetPayload<
  typeof AbsentDriverReturnType
>

export type Aggregate = Prisma.AggregateGetPayload<typeof AggregateReturnType>

export type Client = Prisma.ClientGetPayload<typeof ClientReturnType>

export type Unit = Prisma.UnitGetPayload<typeof UnitReturnType>

export type Vehicle = Prisma.VehicleGetPayload<typeof VehicleReturnType>

export type SemiTrailer = Prisma.SemiTrailerGetPayload<
  typeof SemiTrailerReturnType
>

export type Trailer = Prisma.TrailerGetPayload<typeof TrailerReturnType>

export type TrailerCertificate = Prisma.TrailerCertificateGetPayload<
  typeof TrailerCertificateReturnType
>

export type Truck = Prisma.TruckGetPayload<typeof TruckReturnType>

export type StoppedVehicle = Prisma.StoppedVehicleGetPayload<
  typeof StoppedVehicleReturnType
>
