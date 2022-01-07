import { ethers } from 'ethers'
import axios from 'axios'
import { AGORA_SPACE_API_BASE } from '../../../src/util/consts'
import { signJwt } from '../../../src/util/signJwt'
import { constructAPIGwEvent } from '../../utils/helpers'
import { signIn, userHasAccess, refreshJwtToken } from '../../../src/handlers/apis'

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>


const wallet = ethers.Wallet.createRandom()
const testMessage = 'validateToken'

describe('Test signIn', () => {
    it('should sign in', async () => {
        // Given
        const signature = await wallet.signMessage(testMessage)
        const address = wallet.address
        const guildId = 8
        const event = constructAPIGwEvent({
                message: testMessage,
                signature,
                address,
                guildId,
            },
            { method: 'POST', path: '/signIn' },
        )
        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 666, access: true }] })

        // When
        const result = await signIn(event)

        // Then
        const expectedResult = {
            statusCode: 200,
            body: signJwt({ address, hasAccess: true }),
        }
        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
})

describe('Test userHasAccess', () => {
    it('should return message', async () => {
        const event = constructAPIGwEvent({}, { method: 'GET', path: '/userHasAccess' })

        // Invoke exampleHandler()
        const result = await userHasAccess(event)

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({ message: 'User has access endpoint!' }),
        }

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult)
    })
})

describe('Test refreshJwtToken', () => {
    it('should return message', async () => {
        const event = constructAPIGwEvent({}, { method: 'GET', path: '/refresh' })

        // Invoke exampleHandler()
        const result = await refreshJwtToken(event)

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Refresh token endpoint!' }),
        }

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult)
    })
})
