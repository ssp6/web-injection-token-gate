import { APIGatewayProxyEventV2 } from 'aws-lambda';

export function constructAPIGwEvent(options: Record<string, any> = {}, message?: any): APIGatewayProxyEventV2 {
  return {
    version: options.version || '1',
    routeKey: '',
    rawPath: options.path,
    rawQueryString: '',
    headers: options.headers || {},
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      domainName: 'offlineContext_domainName',
      domainPrefix: 'offlineContext_domainPrefix',
      http: {
        method: options.method || 'GET',
        path: options.path,
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: '',
      },
      requestId: 'offlineContext_resourceId',
      routeKey: '',
      stage: '$default',
      time: '01/Jan/2022:00:00:00 +0000',
      timeEpoch: 1641673652974
    },
    body: options.rawBody || message ? JSON.stringify(message) : undefined,
    isBase64Encoded: false,
  }
}
