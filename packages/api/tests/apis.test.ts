import { ethers } from 'ethers'
import axios from 'axios'
import { AGORA_SPACE_API_BASE } from '../src/util/consts'
import { createSuccessfulCorsResponse } from '../src/util/createSuccessfulCorsResponse'
import { signJwt } from '../src/util/signJwt'
import { signIn, userHasAccess, refreshJwtToken } from '../src/handlers/apis'
import { constructAPIGwEvent } from './utils/helpers'

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
        const event = constructAPIGwEvent({ method: 'POST', path: '/signIn' }, {
                message: testMessage,
                signature,
                address,
                guildId,
            },
        )
        console.log(`signature: ${signature} | address: ${address}`)
        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 666, access: true }] })

        // When
        const result = await signIn(event)

        // Then
        const expectedResult = createSuccessfulCorsResponse(signJwt({ address, hasAccess: true }))
        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
    // TODO: Test what happens if give wrong body
})

describe('Test userHasAccess', () => {
    it('should return message', async () => {
        // Given
        const address = wallet.address
        const guildId = 8
        const event = constructAPIGwEvent({
                method: 'POST',
                path: '/userHasAccess',
                headers: {
                    Authorization: `Bearer ${signJwt({ address, hasAccess: true })}`,
                },
            },
            { guildId },
        )
        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 777, access: false }] })

        // When
        const result = await userHasAccess(event)

        // Then
        const expectedResult = createSuccessfulCorsResponse(signJwt({ address, hasAccess: false }))

        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
})

describe('Test refreshJwtToken', () => {
    it('should return message', async () => {
        const event = constructAPIGwEvent({ method: 'GET', path: '/refresh' })

        // Invoke exampleHandler()
        const result = await refreshJwtToken(event)

        const expectedResult = createSuccessfulCorsResponse(JSON.stringify({ message: 'Refresh token endpoint!' }))

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult)
    })
})
