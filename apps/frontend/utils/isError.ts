import type { ApiResponse, ErrorResponse } from './backendHandler'

export function isError<T, Err>(
  payload: ApiResponse<T, Err>,
): payload is ErrorResponse<Err> {
  return payload.data === undefined
}
