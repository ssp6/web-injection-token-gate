import 'source-map-support/register'
import {
    APIGatewayProxyResultV2,
    APIGatewayProxyEventV2
} from 'aws-lambda'
import { ethers } from 'ethers'
import { createResponse } from '../util/createResponse'
import { signJwt } from '../util/signJwt'
import { userHasAccessToGuild } from '../util/userHasAccessToGuild'
import { verifyJwtPayload } from '../util/verifyJwtPayload'

const confirmHttpType = (event: APIGatewayProxyEventV2, httpType: string) => {
    if (event.requestContext.http.method !== httpType) {
        throw new Error(`Only HTTP method allowed is ${httpType}, you received: ${event.requestContext.http.method} request.`)
    }
}

/**
 * Confirm message has been signed correctly and check if
 * address has access to guild
 */
export const signIn = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)
    confirmHttpType(event, 'POST')
    if (!event.body) {
        throw new Error('Event body required')
    }

    // All errors return 400 just with different message
    try {
        const { message, signature, address, guildId } = JSON.parse(event.body)
        const recoveredAddressFromMessage = ethers.utils.verifyMessage(message, signature)
        if (recoveredAddressFromMessage.toLowerCase() !== address.toLowerCase()) {
            throw new Error('Address recovered form message/signature does not match address given')
        }

        const hasAccess = await userHasAccessToGuild(address, guildId)

        const authToken = signJwt({ address, hasAccess })

        return createResponse._200({ authToken })
    } catch (e) {
        return createResponse._400({ message: e.message })
    }
}

/**
 * Check address in JWT has access to guild
 */
export const userHasAccess = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)
    confirmHttpType(event, 'POST')
    if (!event.body) {
        throw new Error('Event body required')
    }

    // All errors return 400 just with different message
    try {
        const { guildId } = JSON.parse(event.body)
        const authorizationHeader = event.headers['Authorization']
        const jwtToken = authorizationHeader?.split(" ")[1]
        if (!jwtToken) {
            throw new Error('No JWT token in Authorization')
        }

        const { address } = verifyJwtPayload(jwtToken)
        const hasAccess = await userHasAccessToGuild(address, guildId)

        const authToken = signJwt({ address, hasAccess })

        return createResponse._200({ authToken })
    } catch (e) {
        return createResponse._400({ message: e.message })
    }
}

/**
 * Refresh JWT token if expired
 */
export const refreshJwtToken = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)

    return createResponse._200({ message: 'Refresh token endpoint!' })
}

