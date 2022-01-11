import 'source-map-support/register'
import {
    APIGatewayProxyResultV2,
    APIGatewayProxyEventV2,
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
        if (!hasAccess) {
            return createResponse._403({ message: `Address ${address} does not have access to guild ${guildId}` })
        }

        const authToken = signJwt({ address, hasAccess })
        // TODO: Remove authToken from body as it is in the cookie
        return createResponse._200({ authToken })
    } catch (e) {
        return createResponse._400({ message: e.message })
    }
}

/**
 * Check address in authToken cookie has access to guild
 */
export const userHasAccessCookies = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    // All log statements are written to CloudWatch
    console.debug('Received event:', event)
    confirmHttpType(event, 'POST')
    if (!event.body) {
        throw new Error('Event body required')
    }

    // Authorize JWT
    const cookiesObject = event.cookies?.reduce((cookies, cookieString) => {
        const [key, value] = cookieString.split("=", 2)
        cookies[key] = value
        return cookies
    }, {} as { [key: string]: string })

    if (!cookiesObject || !cookiesObject['authToken']) {
        return createResponse._401({ message: "No authToken provided" })
    }

    let decodedJwt
    try {
        console.log("jwt: ", cookiesObject['authToken'])
        decodedJwt = verifyJwtPayload(cookiesObject['authToken'])
    } catch (e) {
        return createResponse._403({ message: e.message })
    }
    const { address } = decodedJwt

    // Check has access to guild
    try {
        const { guildId } = JSON.parse(event.body)
        const hasAccess = await userHasAccessToGuild(address, guildId)

        if (!hasAccess) {
            return createResponse._403({ message: `Address ${address} does not have access to guild ${guildId}` })
        }

        const authToken = signJwt({ address, hasAccess })
        // TODO: Remove authToken from body as it is in the cookie
        return createResponse._200({ authToken }, {
            cookie: `authToken="${authToken}"; HttpOnly; Secure; SameSite=None`,
            origin: event.headers.Origin,
        })
    } catch (e) {
        // Failure to sign or get status from guild
        return createResponse._500({ message: e.message })
    }
}

/**
 * Check address in headers Bearer has access to guild
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

    // Authorize JWT
    if (!event.headers.Authorization) {
        return createResponse._401({ message: 'Unauthorized - no Authorization header' })
    }
    const tokenParts = event.headers.Authorization.split(' ')
    if (!(tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer' && tokenParts[1])) {
        return createResponse._401({ message: 'Unauthorized - no auth token' })
    }
    const jwtToken = tokenParts[1]

    let decodedJwt
    try {
        decodedJwt = verifyJwtPayload(jwtToken)
    } catch (e) {
        return createResponse._403({ message: e.message })
    }
    const { address } = decodedJwt

    // Check has access to guild
    try {
        const { guildId } = JSON.parse(event.body)
        const hasAccess = await userHasAccessToGuild(address, guildId)

        const authToken = signJwt({ address, hasAccess })

        return createResponse._200({ authToken })
    } catch (e) {
        return createResponse._401({ message: e.message })
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

