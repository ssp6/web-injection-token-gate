import jwt from 'jsonwebtoken'
import { JwtDataPayload } from './JwtDataPayload'

export const signJwt = (data: JwtDataPayload) =>
    jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "30m"
    })
