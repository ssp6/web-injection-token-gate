import { NextApiRequest, NextApiResponse } from 'next'
import { fetchUserHasAccessToGuild } from '../../lib/fetchUserHasAccessToGuild'
import { signJwt } from '../../lib/signJwt'
import { timestampNowPlusMinutes } from '../../lib/timestampNowPlusMinutes'
import { verifyJwtPayload } from '../../lib/verifyJwtPayload'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.debug('user-has-access received event:', req)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `${req.method} method not allowed` })
  }

  const authToken = req.cookies?.authToken
  if (!authToken) {
    return res.status(401).json({ error: 'No auth token provided' })
  }

  const { guildUrlName } = req.body || {}
  if (!guildUrlName) {
    return res.status(400).json({
      error: `All arguments required. Received: { guildUrlName: ${guildUrlName} }`
    })
  }

  let decodedJwt
  try {
    console.debug('jwt: ', authToken)
    decodedJwt = verifyJwtPayload(authToken)
  } catch (e) {
    return res.status(403).json({
      error: e.message
    })
  }
  const { address } = decodedJwt
  console.debug('address: ', address)

  try {
    const hasAccess = await fetchUserHasAccessToGuild(address, guildUrlName)
    if (!hasAccess) {
      return res.status(403).send({
        message: `Address ${address} does not have access to guild ${guildUrlName}`
      })
    }

    const authToken = signJwt({ address, hasAccess })
    // TODO: Add Secure;
    return res
      .status(200)
      .setHeader(
        'Set-Cookie',
        `authToken=${authToken}; HttpOnly; Expires=${timestampNowPlusMinutes(
          30
        )}; Path=/`
      )
      .send({ message: 'User has access to guild' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
