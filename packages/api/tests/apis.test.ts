import { ethers } from 'ethers'
import axios from 'axios'
import { AGORA_SPACE_API_BASE } from '../src/util/consts'
import { createResponse } from '../src/util/createResponse'
import { signJwt } from '../src/util/signJwt'
import { signIn, userHasAccess, refreshJwtToken, userHasAccessCookies } from '../src/handlers/apis'
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
        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 666, access: true }] })

        // When
        const result = await signIn(event)

        // Then
        const authToken = signJwt({ address, hasAccess: true })
        const expectedResult = createResponse._200({ authToken }, `authToken="${authToken}"; HttpOnly; Secure;`)
        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
    // TODO: Test what happens if give wrong body
})

describe('Test userHasAccessCookies', () => {
    it('should 200, given address has access to site', async () => {
        // Given
        const address = wallet.address
        const guildId = 8
        const event = constructAPIGwEvent({
                method: 'POST',
                path: '/userHasAccess',
                cookies: [`authToken=${signJwt({ address, hasAccess: true })}`],
            },
            { guildId },
        )

        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 777, access: true }] })

        // When
        const result = await userHasAccessCookies(event)

        // Then
        const authToken = signJwt({ address, hasAccess: true })
        const expectedResult = createResponse._200({ authToken }, `authToken="${authToken}"; HttpOnly; Secure;`)

        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })

    it('should return 401, given no authToken cookie', async () => {
        // Given
        const guildId = 8
        const event = constructAPIGwEvent({
                method: 'POST',
                path: '/userHasAccess',
            },
            { guildId },
        )

        // When
        const result = await userHasAccessCookies(event)

        // Then
        const expectedResult = createResponse._401({ message: "No authToken provided" })

        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledTimes(0)
    })

    it('should return 403, given address does not have access', async () => {
        // Given
        const address = wallet.address
        const guildId = 8
        const event = constructAPIGwEvent({
                method: 'POST',
                path: '/userHasAccess',
                cookies: [`authToken=${signJwt({ address, hasAccess: false })}`],
            },
            { guildId },
        )

        mockAxios.get.mockResolvedValueOnce({ data: [{ roleId: 777, access: false }] })

        // When
        const result = await userHasAccessCookies(event)

        // Then
        const expectedResult = createResponse._403({ message: `Address ${address} does not have access to guild ${guildId}`})

        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
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
        const expectedResult = createResponse._200({ authToken: signJwt({ address, hasAccess: false }) })

        expect(result).toEqual(expectedResult)
        expect(mockAxios.get).toHaveBeenCalledWith(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${address}`)
    })
})

describe('Test refreshJwtToken', () => {
    it('should return message', async () => {
        const event = constructAPIGwEvent({ method: 'GET', path: '/refresh' })

        // Invoke exampleHandler()
        const result = await refreshJwtToken(event)

        const expectedResult = createResponse._200({ message: 'Refresh token endpoint!' })

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult)
    })
})
