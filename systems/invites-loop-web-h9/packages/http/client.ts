export type ApiSuccessResponse<T> = {
  success: true
  data: T
  message?: string
}

export type ApiErrorResponse = {
  success: false
  message: string
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getErrorMessage = (value: unknown): string | undefined => {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const message = value['message']
  return typeof message === 'string' ? message : undefined
}

const parseResponseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly payload: unknown

  constructor(params: {
    status: number
    statusText: string
    url: string
    payload: unknown
    message?: string
  }) {
    super(params.message ?? params.statusText)
    this.name = 'HttpError'
    this.status = params.status
    this.statusText = params.statusText
    this.url = params.url
    this.payload = params.payload
  }
}

const request = async <T>(
  url: string,
  init: RequestInit = {},
): Promise<ApiSuccessResponse<T>> => {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  const response = await fetch(url, {
    ...init,
    headers,
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new HttpError({
      status: response.status,
      statusText: response.statusText,
      url,
      payload: body,
      message: getErrorMessage(body),
    })
  }

  if (!isObjectRecord(body) || body['success'] !== true || !('data' in body)) {
    throw new HttpError({
      status: response.status,
      statusText: response.statusText,
      url,
      payload: body,
      message: '유효하지 않은 API 응답입니다.',
    })
  }

  return body as ApiSuccessResponse<T>
}

export const httpClient = {
  get: <T>(url: string, options: RequestInit = {}) => {
    return request<T>(url, {
      ...options,
      method: 'GET',
    })
  },

  post: <Req, T>(url: string, body: Req, options: RequestInit = {}) => {
    const headers = new Headers(options.headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return request<T>(url, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  },
}
