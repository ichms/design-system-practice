type ProxyRouteContext<TParams extends Record<string, string> = Record<string, string>> = {
  params: Promise<TParams>
}

type ProxyFallbackHandler<TParams extends Record<string, string>> = (
  request: Request,
  context: ProxyRouteContext<TParams>,
) => Promise<Response>

type CreateProxyRouteHandlerParams<TParams extends Record<string, string>> = {
  buildPath: (params: TParams, request: Request) => string
  fallback: ProxyFallbackHandler<TParams>
  baseUrl?: string
}

const sanitizeBaseUrl = (baseUrl: string) => {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

const buildProxyUrl = (baseUrl: string, path: string, request: Request) => {
  const requestUrl = new URL(request.url)
  const search = requestUrl.search
  const normalizedBaseUrl = sanitizeBaseUrl(baseUrl)

  return `${normalizedBaseUrl}${path}${search}`
}

const cloneHeaders = (request: Request) => {
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')
  return headers
}

export const createProxyRouteHandler = <
  TParams extends Record<string, string> = Record<string, string>,
>({
  buildPath,
  fallback,
  baseUrl = process.env.OPERATION_SERVER_BASE_URL,
}: CreateProxyRouteHandlerParams<TParams>) => {
  return async (request: Request, context: ProxyRouteContext<TParams>) => {
    const resolvedParams = await context.params

    if (!baseUrl) {
      return fallback(request, {
        params: Promise.resolve(resolvedParams),
      })
    }

    const upstreamResponse = await fetch(buildProxyUrl(baseUrl, buildPath(resolvedParams, request), request), {
      method: request.method,
      headers: cloneHeaders(request),
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
      redirect: 'manual',
      cache: 'no-store',
    })

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: upstreamResponse.headers,
    })
  }
}

export type { ProxyRouteContext }
