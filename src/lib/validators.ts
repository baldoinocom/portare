export const validLicensePlate = (licensePlate: string | undefined) => {
  if (!licensePlate) return true

  const isOldFormat = /^[A-Z]{3}-?\d{4}$/.test(licensePlate)
  const isNewFormat = /^[A-Z]{3}-?\d[A-Z]\d{2}$/.test(licensePlate)

  if (!(isOldFormat || isNewFormat)) return false

  return true
}

export const validRenavam = (renavam: string | undefined) => {
  if (!renavam) return true

  renavam = renavam.replace(/[^\d]/g, '')
  if (renavam.length < 9 || renavam.length > 11) return false

  renavam = renavam.padStart(11, '0')
  if (/^(\d)\1+$/.test(renavam)) return false

  let sum = 0
  let weight = 2
  for (let i = renavam.length - 2; i >= 0; i--) {
    sum += Number(renavam.charAt(i)) * weight
    weight = weight < 9 ? weight + 1 : 2
  }
  const mod = sum % 11
  const result = mod < 2 ? 0 : 11 - mod

  return result === parseInt(renavam.charAt(renavam.length - 1))
}

export const validCEP = (cep: string | undefined) => {
  if (!cep) return true

  cep = cep.replace(/[^\d]/g, '')
  return cep.length === 8
}

export const validCNH = (cnh: string | undefined) => {
  if (!cnh) return true

  cnh = cnh.replace(/[^\d]/g, '')
  if (cnh.length !== 11) return false

  return !/^(\d)\1+$/.test(cnh)
}

export const validDocument = (
  document: string | undefined,
  type?: 'cpf' | 'cnpj',
) => {
  if (!document) return true

  document = document.replace(/[^\d]/g, '')
  if (document.length !== 11 && document.length !== 14) return false

  if (type) {
    if (type === 'cpf') {
      return validCPF(document)
    } else {
      return validCNPJ(document)
    }
  }

  return validCPF(document) || validCNPJ(document)
}

export const validCPF = (cpf: string | undefined) => {
  if (!cpf) return true

  cpf = cpf.replace(/[^\d]/g, '')
  if (cpf.length !== 11) return false

  if (/^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf[i - 1]) * (11 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== parseInt(cpf[9])) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf[i - 1]) * (12 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== parseInt(cpf[10])) return false

  return true
}

export const validCNPJ = (cnpj: string | undefined) => {
  if (!cnpj) return true

  cnpj = cnpj.replace(/[^\d]/g, '')
  if (cnpj.length !== 14) return false

  if (/^(\d)\1+$/.test(cnpj)) return false

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return result === parseInt(digits.charAt(1))
}
