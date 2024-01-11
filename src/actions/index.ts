import { aggregateAction } from './aggregate'
import { brandAction } from './brand'
import { cargoAction } from './cargo'
import { clientAction } from './client'
import { companyAction } from './company'
import { driverAction } from './driver'
import { fleetAction } from './fleet'
import { personAction } from './person'
import { semiTrailerAction } from './semi-trailer'
import { trailerAction } from './trailer'
import { trailerConfigurationAction } from './trailer-configuration'
import { trailerTypeAction } from './trailer-type'
import { truckAction } from './truck'
import { vehicleAction } from './vehicle'

export const action = {
  aggregate: aggregateAction,
  brand: brandAction,
  cargo: cargoAction,
  client: clientAction,
  company: companyAction,
  driver: driverAction,
  fleet: fleetAction,
  person: personAction,
  semiTrailer: semiTrailerAction,
  trailer: trailerAction,
  trailerConfiguration: trailerConfigurationAction,
  trailerType: trailerTypeAction,
  truck: truckAction,
  vehicle: vehicleAction,
}
