import jwt from 'jsonwebtoken'

type JwtData = {
    address: string,
    hasAccess: boolean
}

export const signJwt = (data: JwtData) =>
    jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "30m"
    })
