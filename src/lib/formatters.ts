export const formatLicensePlate = (licensePlate: string | undefined) => {
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

export const formatRenavam = (renavam: string | undefined) => {
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

export const formatCPF = (cpf: string | undefined) => {
  cpf = cpf?.replace(/\D/g, '')
  cpf = cpf?.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf?.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf?.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return cpf
}

export const formatCNPJ = (cnpj: string | undefined) => {
  cnpj = cnpj?.replace(/\D/g, '')
  cnpj = cnpj?.replace(/^(\d{2})(\d)/, '$1.$2')
  cnpj = cnpj?.replace(/^(\d{2}).(\d{3})(\d)/, '$1.$2.$3')
  cnpj = cnpj?.replace(/.(\d{3})(\d)/, '.$1/$2')
  cnpj = cnpj?.replace(/(\d{4})(\d)/, '$1-$2')
  return cnpj
}

export const formatPhoneNumber = (phoneNumber: string | undefined) => {
  phoneNumber = phoneNumber?.replace(/\D/g, '')
  phoneNumber = phoneNumber?.replace(/^(\d{2})(\d)/, '($1) $2')
  phoneNumber = phoneNumber?.replace(/(\d{5})(\d)/, '$1-$2')
  return phoneNumber
}

export const formatUF = (state: string) => {
  switch (state) {
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
