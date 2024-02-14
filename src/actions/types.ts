import { Prisma } from '@prisma/client'

export const userResource = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { person: true, groups: true },
})
export type UserResource = Prisma.UserGetPayload<typeof userResource>

export const companyResource = Prisma.validator<Prisma.CompanyDefaultArgs>()({
  include: { address: true },
})
export type CompanyResource = Prisma.CompanyGetPayload<typeof companyResource>

export const clientResource = Prisma.validator<Prisma.ClientDefaultArgs>()({
  include: { company: companyResource },
})
export type ClientResource = Prisma.ClientGetPayload<typeof clientResource>

export const unitResource = Prisma.validator<Prisma.UnitDefaultArgs>()({
  include: { company: companyResource },
})
export type UnitResource = Prisma.UnitGetPayload<typeof unitResource>

export const aggregateResource =
  Prisma.validator<Prisma.AggregateDefaultArgs>()({
    include: { company: companyResource, unit: unitResource },
  })
export type AggregateResource = Prisma.AggregateGetPayload<
  typeof aggregateResource
>

export const personResource = Prisma.validator<Prisma.PersonDefaultArgs>()({
  include: { unit: unitResource, aggregate: aggregateResource },
})
export type PersonResource = Prisma.PersonGetPayload<typeof personResource>

export const driverResource = Prisma.validator<Prisma.DriverDefaultArgs>()({
  include: { person: personResource },
})
export type DriverResource = Prisma.DriverGetPayload<typeof driverResource>

export const aSOResource = Prisma.validator<Prisma.ASODefaultArgs>()({
  include: { driver: driverResource },
})
export type ASOResource = Prisma.ASOGetPayload<typeof aSOResource>

export const absentDriverResource =
  Prisma.validator<Prisma.AbsentDriverDefaultArgs>()({
    include: { driver: driverResource },
  })
export type AbsentDriverResource = Prisma.AbsentDriverGetPayload<
  typeof absentDriverResource
>

export const vehicleResource = Prisma.validator<Prisma.VehicleDefaultArgs>()({
  include: { brand: true, unit: unitResource, aggregate: aggregateResource },
})
export type VehicleResource = Prisma.VehicleGetPayload<typeof vehicleResource>

export const trailerResource = Prisma.validator<Prisma.TrailerDefaultArgs>()({
  include: { vehicle: vehicleResource },
})
export type TrailerResource = Prisma.TrailerGetPayload<typeof trailerResource>

export const trailerCertificateResource =
  Prisma.validator<Prisma.TrailerCertificateDefaultArgs>()({
    include: { trailer: trailerResource },
  })
export type TrailerCertificateResource = Prisma.TrailerCertificateGetPayload<
  typeof trailerCertificateResource
>

export const semiTrailerResource =
  Prisma.validator<Prisma.SemiTrailerDefaultArgs>()({
    include: {
      type: true,
      cargos: true,
      configuration: true,
      trailers: trailerResource,
    },
  })
export type SemiTrailerResource = Prisma.SemiTrailerGetPayload<
  typeof semiTrailerResource
>

export const truckResource = Prisma.validator<Prisma.TruckDefaultArgs>()({
  include: { vehicle: vehicleResource },
})
export type TruckResource = Prisma.TruckGetPayload<typeof truckResource>

export const stoppedVehicleResource =
  Prisma.validator<Prisma.StoppedVehicleDefaultArgs>()({
    include: { vehicle: vehicleResource },
  })
export type StoppedVehicleResource = Prisma.StoppedVehicleGetPayload<
  typeof stoppedVehicleResource
>

export const tripResource = Prisma.validator<Prisma.TripDefaultArgs>()({
  include: {
    origin: clientResource,
    destination: clientResource,
    driver: driverResource,
    truck: truckResource,
    semiTrailer: semiTrailerResource,
    cargo: true,
    unit: unitResource,
    aggregate: aggregateResource,
  },
})
export type TripResource = Prisma.TripGetPayload<typeof tripResource>

export const groupingResource = Prisma.validator<Prisma.GroupingDefaultArgs>()({
  include: {
    driver: driverResource,
    truck: truckResource,
    semiTrailer: semiTrailerResource,
  },
})
export type GroupingResource = Prisma.GroupingGetPayload<
  typeof groupingResource
>
