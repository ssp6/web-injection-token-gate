import { constructAPIGwEvent } from '../../utils/helpers';

import { signIn, userHasAccess, refreshJwtToken } from '../../../src/handlers/apis';

describe('Test signIn', () => {
  it('should return message', async () => {
    const event = constructAPIGwEvent({}, { method: 'GET', path: '/' });

    // Invoke exampleHandler()
    const result = await signIn(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Sign in endpoint!' })
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});

describe('Test userHasAccess', () => {
  it('should return message', async () => {
    const event = constructAPIGwEvent({}, { method: 'GET', path: '/' });

    // Invoke exampleHandler()
    const result = await userHasAccess(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'User has access endpoint!' })
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});

describe('Test refreshJwtToken', () => {
  it('should return message', async () => {
    const event = constructAPIGwEvent({}, { method: 'GET', path: '/' });

    // Invoke exampleHandler()
    const result = await refreshJwtToken(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Refresh token endpoint!' })
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
