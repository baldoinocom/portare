import { Prisma } from '@prisma/client'

const UserReturnType = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { person: true },
})
export type UserInclude = Prisma.UserGetPayload<typeof UserReturnType>

const DriverReturnType = Prisma.validator<Prisma.DriverDefaultArgs>()({
  include: {
    person: {
      include: {
        unit: { include: { company: true } },
        aggregate: { include: { person: true, company: true } },
      },
    },
  },
})
export type DriverInclude = Prisma.DriverGetPayload<typeof DriverReturnType>

const ASOReturnType = Prisma.validator<Prisma.ASODefaultArgs>()({
  include: { driver: { include: { person: true } } },
})
export type ASOInclude = Prisma.ASOGetPayload<typeof ASOReturnType>

const AbsentDriverReturnType =
  Prisma.validator<Prisma.AbsentDriverDefaultArgs>()({
    include: { driver: { include: { person: true } } },
  })
export type AbsentDriverInclude = Prisma.AbsentDriverGetPayload<
  typeof AbsentDriverReturnType
>

const AggregateReturnType = Prisma.validator<Prisma.AggregateDefaultArgs>()({
  include: { company: true, person: true },
})
export type AggregateInclude = Prisma.AggregateGetPayload<
  typeof AggregateReturnType
>

const ClientReturnType = Prisma.validator<Prisma.ClientDefaultArgs>()({
  include: { company: true },
})
export type ClientInclude = Prisma.ClientGetPayload<typeof ClientReturnType>

const UnitReturnType = Prisma.validator<Prisma.UnitDefaultArgs>()({
  include: { company: true },
})
export type UnitInclude = Prisma.UnitGetPayload<typeof UnitReturnType>

const VehicleReturnType = Prisma.validator<Prisma.VehicleDefaultArgs>()({
  include: { brand: true },
})
export type VehicleInclude = Prisma.VehicleGetPayload<typeof VehicleReturnType>

const SemiTrailerReturnType = Prisma.validator<Prisma.SemiTrailerDefaultArgs>()(
  {
    include: {
      type: true,
      cargos: true,
      configuration: true,
      trailers: {
        include: {
          vehicle: {
            include: { brand: true, unit: { include: { company: true } } },
          },
        },
      },
    },
  },
)
export type SemiTrailerInclude = Prisma.SemiTrailerGetPayload<
  typeof SemiTrailerReturnType
>

const TrailerReturnType = Prisma.validator<Prisma.TrailerDefaultArgs>()({
  include: {
    vehicle: { include: { brand: true, unit: { include: { company: true } } } },
  },
})
export type TrailerInclude = Prisma.TrailerGetPayload<typeof TrailerReturnType>

const TrailerCertificateReturnType =
  Prisma.validator<Prisma.TrailerCertificateDefaultArgs>()({
    include: {
      trailer: { include: { vehicle: { include: { brand: true } } } },
    },
  })
export type TrailerCertificateInclude = Prisma.TrailerCertificateGetPayload<
  typeof TrailerCertificateReturnType
>

const TruckReturnType = Prisma.validator<Prisma.TruckDefaultArgs>()({
  include: {
    vehicle: {
      include: {
        brand: true,
        unit: { include: { company: true } },
        aggregate: { include: { person: true, company: true } },
      },
    },
  },
})
export type TruckInclude = Prisma.TruckGetPayload<typeof TruckReturnType>

const StoppedVehicleReturnType =
  Prisma.validator<Prisma.StoppedVehicleDefaultArgs>()({
    include: { vehicle: { include: { brand: true } } },
  })
export type StoppedVehicleInclude = Prisma.StoppedVehicleGetPayload<
  typeof StoppedVehicleReturnType
>
