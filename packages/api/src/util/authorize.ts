import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { verifyJwtPayload } from './verifyJwtPayload'

/**
 * TODO: Decide if this is worth using as serverless authorizer — taken from scaffold-eth-examples/serverless-auth
 *
 * Authorizer functions are executed before your actual functions.
 * @method authorize
 * @param {String} event.headers.authorization - JWT
 * @throws Returns 401 if the token is invalid or has expired.
 * @throws Returns 403 if the token does not have sufficient permissions.
 */
export const authorizeJwt = (event: APIGatewayProxyEventV2) => {
    console.debug('Authorizing event: ', event)
    if (!event.headers.authorization) {
        throw new Error('Unauthorized - no authorization header')
    }

    const tokenParts = event.headers.authorization.split(' ')
    if (!(tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer' && tokenParts[1])) {
        throw new Error('Unauthorized - no auth token')
    }
    const tokenValue = tokenParts[1]

    try {
        // Verify JWT
        const { address } = verifyJwtPayload(tokenValue)

        const authorizerContext = { user: address }
        // Return an IAM policy document for the current endpoint
        // const policyDocument = buildIAMPolicy(publicAddress, 'Allow', event.routeArn, authorizerContext);
        // callback(null, policyDocument);
    } catch (e: any) {
        console.log({e})
        throw new Error('Unauthorized - no authorization header');
    }
}
