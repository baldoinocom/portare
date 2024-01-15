import { absentDriverAction } from './absent-driver'
import { aggregateAction } from './aggregate'
import { asoAction } from './aso'
import { brandAction } from './brand'
import { cargoAction } from './cargo'
import { clientAction } from './client'
import { companyAction } from './company'
import { driverAction } from './driver'
import { fleetAction } from './fleet'
import { personAction } from './person'
import { semiTrailerAction } from './semi-trailer'
import { stoppedVehicleAction } from './stopped-vehicle'
import { trailerAction } from './trailer'
import { trailerCertificateAction } from './trailer-certificate'
import { trailerConfigurationAction } from './trailer-configuration'
import { trailerTypeAction } from './trailer-type'
import { truckAction } from './truck'
import { vehicleAction } from './vehicle'

export const action = {
  absentDriver: absentDriverAction,
  aggregate: aggregateAction,
  aso: asoAction,
  brand: brandAction,
  cargo: cargoAction,
  client: clientAction,
  company: companyAction,
  driver: driverAction,
  fleet: fleetAction,
  person: personAction,
  semiTrailer: semiTrailerAction,
  stoppedVehicle: stoppedVehicleAction,
  trailer: trailerAction,
  trailerCertificate: trailerCertificateAction,
  trailerConfiguration: trailerConfigurationAction,
  trailerType: trailerTypeAction,
  truck: truckAction,
  vehicle: vehicleAction,
}
