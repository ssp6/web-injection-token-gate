import { APIGatewayProxyResultV2 } from 'aws-lambda'

type Options = {
    cookie?: string,
    origin?: string
}
const _200 = (body: { [key: string]: any }, { cookie, origin }: Options = {}): APIGatewayProxyResultV2 => ({
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        ...(cookie ? { 'Set-Cookie': cookie } : {})
    },
    body: body ? JSON.stringify(body, null, 2) : undefined,
})

const _400 = (body?: { [key: string]: any }): APIGatewayProxyResultV2 => ({
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body, null, 2) : undefined,
})

const _401 = (body?: { [key: string]: any }): APIGatewayProxyResultV2 => ({
    statusCode: 401,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body, null, 2) : undefined,
})

const _403 = (body?: { [key: string]: any }): APIGatewayProxyResultV2 => ({
    statusCode: 401,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body, null, 2) : undefined,
})

const _500 = (body?: { [key: string]: any }): APIGatewayProxyResultV2 => ({
    statusCode: 401,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body, null, 2) : undefined,
})

export const createResponse = {
    _200,
    _400,
    _401,
    _403,
    _500
}
