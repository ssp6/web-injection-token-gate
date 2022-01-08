import { JwtPayload } from 'jsonwebtoken'

/**
 * Data type of payload given to JWT
 */
export interface JwtDataPayload {
    address: string,
    hasAccess: boolean, // TODO: Make more robust with some signed code?
}

/**
 * Data type of JWT payload once verifyed
 */
export interface JwtDataPayloadDecoded extends JwtPayload, JwtDataPayload {}
