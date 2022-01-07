import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';

/**
 * Confirm message has been signed correctly and check if
 * address has access to guild
 */
export const signIn = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sign in endpoint!',
    })
  };
}

/**
 * Check address in JWT has access to guild
 */
export const userHasAccess = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User has access endpoint!',
    })
  };
}

/**
 * Refresh JWT token if expired
 */
export const refreshJwtToken = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Refresh token endpoint!',
    })
  };
}
