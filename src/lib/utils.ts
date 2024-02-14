import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const extractNumber = (value: string) => {
  return value.replace(/[^\d]/g, '')
}

export const sleep = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export const findRepeatedStrings = (
  array: (string | undefined | null)[],
): (string | undefined | null)[] => {
  return array
    .filter((v) => v)
    .filter(
      (value, index, array) =>
        array.findIndex((v) => v?.toUpperCase() === value?.toUpperCase()) !==
        index,
    )
}

export const emptyAsNull = <T>(
  value: T | null | undefined,
): T | null | undefined => {
  if (typeof value !== 'undefined') {
    if (!value || (typeof value === 'string' && !value.trim())) return null
  }

  return value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number,
) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any }

export const nullAsUndefined = (
  value: AnyObject | null | undefined,
): AnyObject | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value.map((item) => nullAsUndefined(item))
  }

  const result: AnyObject = {}

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      if (value[key] === null) {
        result[key] = undefined
      } else if (typeof value[key] === 'object') {
        result[key] = nullAsUndefined(value[key])
      } else {
        result[key] = value[key]
      }
    }
  }

  return result
}
