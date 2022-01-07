import 'source-map-support/register'
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { ethers } from 'ethers'
import { signJwt } from '../util/signJwt'
import { userHasAccessToGuild } from '../util/userHasAccessToGuild'

const confirmHttpType = (event: APIGatewayProxyEvent, httpType: string) => {
    if (event.httpMethod !== httpType) {
        throw new Error(`Only HTTP method allowed is ${httpType}, you received: ${event.httpMethod} request.`)
    }
}

/**
 * Confirm message has been signed correctly and check if
 * address has access to guild
 */
export const signIn = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)
    confirmHttpType(event, 'POST')
    if (!event.body) {
        throw new Error('Event body required')
    }

    const { message, signature, address, guildId } = JSON.parse(event.body)

    try {
        const recoveredAddressFromMessage = ethers.utils.verifyMessage(message, signature)
        if (recoveredAddressFromMessage.toLowerCase() !== address.toLowerCase()) {
            throw new Error('Address recovered form message/signature does not match address given')
        }

        const hasAccess = await userHasAccessToGuild(address, guildId)

        const jwt = signJwt({ address, hasAccess })

        return {
            statusCode: 200,
            body: jwt,
        }
    } catch (e: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: e.message,
            }),
        }
    }
}

/**
 * Check address in JWT has access to guild
 */
export const userHasAccess = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'User has access endpoint!',
        }),
    }
}

/**
 * Refresh JWT token if expired
 */
export const refreshJwtToken = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Refresh token endpoint!',
        }),
    }
}
