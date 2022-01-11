import jwt from 'jsonwebtoken'
import { JwtDataPayload, JwtDataPayloadDecoded } from './JwtDataPayload'

export const verifyJwtPayload = (jwtString: string): JwtDataPayload => {
    try {
        const jwtPayload = jwt.verify(jwtString, process.env.JWT_SECRET!) as JwtDataPayloadDecoded
        const { address, hasAccess } = jwtPayload

        return { address, hasAccess }
    } catch (e: any) {
        throw new Error(`Unable to verify jwt: ${e.message}`)
    }
}
