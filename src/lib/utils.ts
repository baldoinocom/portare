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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any }

export const nullAsUndefined = (
  obj: AnyObject | undefined,
): AnyObject | undefined => {
  if (obj === undefined) {
    return undefined
  }

  const result: AnyObject = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === null) {
        result[key] = undefined
      } else if (typeof obj[key] === 'object') {
        result[key] = nullAsUndefined(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }

  return result
}
