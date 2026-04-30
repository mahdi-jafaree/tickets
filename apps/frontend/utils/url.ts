import { isValid, parse } from 'date-fns'
import type { ReadonlyURLSearchParams } from 'next/navigation'

export function constructUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
): string {
  const queryParts: string[] = []
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
    }
  })
  const queryString = queryParts.join('&')
  const url = queryString ? `${path}?${queryString}` : path

  return url
}

export function setQueryParam(
  params: ReadonlyURLSearchParams,
  key: string,
  value?: string,
  removePage = true,
) {
  const searchParams = new URLSearchParams(params.toString())
  if (removePage) {
    searchParams.delete('page')
  }
  if (value) {
    searchParams.set(key, value)
    return searchParams
  }
  searchParams.delete(key)
  return searchParams
}

export const safeParseDateParam = (param: string | null): Date | undefined => {
  if (!param) return undefined
  const date = parse(param, 'dd-MM-yyyy', new Date())
  return isValid(date) ? date : undefined
}
