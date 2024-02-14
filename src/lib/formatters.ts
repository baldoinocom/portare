export const formatLicensePlate = (licensePlate: string | undefined | null) => {
  licensePlate = licensePlate?.toUpperCase()
  licensePlate = licensePlate
    ?.replace(/[^A-Za-z0-9]/g, '')
    .replace(/(\d{4})$/g, '$1')

  if (licensePlate?.length === 7) {
    licensePlate = licensePlate.replace(/(\w{3})(\d{4})$/, '$1-$2')
  } else if (licensePlate?.length === 8) {
    licensePlate = licensePlate.replace(/(\w{3})(\d{1})(\w{2})$/, '$1$2$3')
    licensePlate = licensePlate.slice(0, -1)
  }
  return licensePlate
}

export const formatRenavam = (renavam: string | undefined | null) => {
  renavam = renavam?.replace(/\D/g, '')
  renavam = renavam?.replace(/^(\d{4})(\d)/, '$1 $2')
  renavam = renavam?.replace(/^(\d{4})\s(\d{5})(\d)/, '$1 $2 $3')
  renavam = renavam?.replace(/^(\d{4})\s(\d{5})\s(\d{2})(\d)/, '$1 $2 $3 $4')
  renavam = renavam?.replace(
    /^(\d{4})\s(\d{5})\s(\d{2})\s(\d{1})(\d)/,
    '$1 $2 $3 $4 $5',
  )
  return renavam
}

export const formatDocument = (document: string | undefined | null) => {
  switch (document?.length) {
    case 11:
      return formatCPF(document)
    case 14:
      return formatCNPJ(document)
    default:
      return document
  }
}

export const formatCPF = (cpf: string | undefined | null) => {
  cpf = cpf?.replace(/\D/g, '')
  cpf = cpf?.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf?.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf?.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return cpf
}

export const formatCNPJ = (cnpj: string | undefined | null) => {
  cnpj = cnpj?.replace(/\D/g, '')
  cnpj = cnpj?.replace(/^(\d{2})(\d)/, '$1.$2')
  cnpj = cnpj?.replace(/^(\d{2}).(\d{3})(\d)/, '$1.$2.$3')
  cnpj = cnpj?.replace(/.(\d{3})(\d)/, '.$1/$2')
  cnpj = cnpj?.replace(/(\d{4})(\d)/, '$1-$2')
  return cnpj
}

export const formatPhoneNumber = (phoneNumber: string | undefined | null) => {
  phoneNumber = phoneNumber?.replace(/\D/g, '')
  phoneNumber = phoneNumber?.replace(/^(\d{2})(\d)/, '($1) $2')
  phoneNumber = phoneNumber?.replace(/(\d{5})(\d)/, '$1-$2')
  return phoneNumber
}

export const formatUF = (state: string | undefined | null) => {
  switch (state?.toLowerCase()) {
    case 'ac':
      return 'Acre'
    case 'al':
      return 'Alagoas'
    case 'ap':
      return 'Amapá'
    case 'am':
      return 'Amazonas'
    case 'ba':
      return 'Bahia'
    case 'ce':
      return 'Ceará'
    case 'es':
      return 'Espírito Santo'
    case 'go':
      return 'Goiás'
    case 'ma':
      return 'Maranhão'
    case 'mt':
      return 'Mato Grosso'
    case 'ms':
      return 'Mato Grosso do Sul'
    case 'mg':
      return 'Minas Gerais'
    case 'pa':
      return 'Pará'
    case 'pb':
      return 'Paraíba'
    case 'pr':
      return 'Paraná'
    case 'pe':
      return 'Pernambuco'
    case 'pi':
      return 'Piauí'
    case 'rj':
      return 'Rio de Janeiro'
    case 'rn':
      return 'Rio Grande do Norte'
    case 'rs':
      return 'Rio Grande do Sul'
    case 'ro':
      return 'Rondônia'
    case 'rr':
      return 'Roraima'
    case 'sc':
      return 'Santa Catarina'
    case 'sp':
      return 'São Paulo'
    case 'se':
      return 'Sergipe'
    case 'to':
      return 'Tocantins'
    default:
      return state
  }
}

export const formatExpirationType = (type: string | undefined | null) => {
  switch (type) {
    case 'quarterly':
      return 'Trimestral'
    case 'yearly':
      return 'Anual'
    default:
      return type
  }
}

export const formatVehicleStatus = (status: string | undefined | null) => {
  switch (status) {
    case 'maintenance':
      return 'Manutenção'
    case 'documentation':
      return 'Documentação'
    default:
      return status
  }
}

export const formatDriverStatus = (status: string | undefined | null) => {
  switch (status) {
    case 'leaveOfAbsence':
      return 'Afastado'
    case 'medicalCertificate':
      return 'Atestado'
    case 'break':
      return 'Folga'
    case 'vacation':
      return 'Férias'
    default:
      return status
  }
}

export const formatTripStatus = (status: string | undefined | null) => {
  switch (status) {
    case 'scheduled':
      return 'Agendado'
    case 'loaded':
      return 'Carregado'
    case 'departure':
      return 'Partida'
    case 'terminal':
      return 'Terminal'
    case 'unloaded':
      return 'Descarregado'
    case 'finished':
      return 'Finalizado'
    case 'canceled':
      return 'Cancelado'
    default:
      return status
  }
}
