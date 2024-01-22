import { Prisma } from '@prisma/client'

const UserReturnType = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { person: true },
})

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

export type UserInclude = Prisma.UserGetPayload<typeof UserReturnType>

export type DriverInclude = Prisma.DriverGetPayload<typeof DriverReturnType>

export type ASOInclude = Prisma.ASOGetPayload<typeof ASOReturnType>

export type AbsentDriverInclude = Prisma.AbsentDriverGetPayload<
  typeof AbsentDriverReturnType
>

export type AggregateInclude = Prisma.AggregateGetPayload<
  typeof AggregateReturnType
>

export type ClientInclude = Prisma.ClientGetPayload<typeof ClientReturnType>

export type UnitInclude = Prisma.UnitGetPayload<typeof UnitReturnType>

export type VehicleInclude = Prisma.VehicleGetPayload<typeof VehicleReturnType>

export type SemiTrailerInclude = Prisma.SemiTrailerGetPayload<
  typeof SemiTrailerReturnType
>

export type TrailerInclude = Prisma.TrailerGetPayload<typeof TrailerReturnType>

export type TrailerCertificateInclude = Prisma.TrailerCertificateGetPayload<
  typeof TrailerCertificateReturnType
>

export type TruckInclude = Prisma.TruckGetPayload<typeof TruckReturnType>

export type StoppedVehicleInclude = Prisma.StoppedVehicleGetPayload<
  typeof StoppedVehicleReturnType
>
