import { APIGatewayProxyResultV2 } from 'aws-lambda'

export const createSuccessfulCorsResponse = (body?: string): APIGatewayProxyResultV2 => ({
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body,
})
