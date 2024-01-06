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

export type Driver = Prisma.DriverGetPayload<typeof DriverReturnType>

export type Aggregate = Prisma.AggregateGetPayload<typeof AggregateReturnType>

export type Client = Prisma.ClientGetPayload<typeof ClientReturnType>

export type Fleet = Prisma.FleetGetPayload<typeof FleetReturnType>
