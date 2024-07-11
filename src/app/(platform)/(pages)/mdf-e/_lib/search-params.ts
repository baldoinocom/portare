import {
  createSearchParamsCache,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server'

const state = ['sc', 'pr'] as const

export const searchParams = {
  state: parseAsStringLiteral(state).withDefault('sc'),
  closed: parseAsBoolean.withDefault(false),

  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(30),
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
