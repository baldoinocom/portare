import { aggregateAction } from './aggregate'
import { clientAction } from './client'
import { companyAction } from './company'
import { driverAction } from './driver'
import { fleetAction } from './fleet'
import { personAction } from './person'
import { semiTrailerAction } from './semi-trailer'
import { trailerAction } from './trailer'
import { truckAction } from './truck'
import { vehicleAction } from './vehicle'

export const action = {
  aggregate: aggregateAction,
  client: clientAction,
  company: companyAction,
  driver: driverAction,
  fleet: fleetAction,
  person: personAction,
  semiTrailer: semiTrailerAction,
  trailer: trailerAction,
  truck: truckAction,
  vehicle: vehicleAction,
}
