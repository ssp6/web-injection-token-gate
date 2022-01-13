import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { createMessage } from '../../lib/createMessage'
import { fetchUserHasAccessToGuild } from '../../lib/fetchUserHasAccessToGuild'
import { signJwt } from '../../lib/signJwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.debug('sign-in received event:', req)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `${req.method} method not allowed` })
  }

  const { signature, address, guildUrlName, timeStamp } = req.body || {}
  if (!signature || !address || !guildUrlName || !timeStamp) {
    return res.status(400).json({
      error: `All arguments required. Received: { signature: ${signature}, address: ${address}, guildUrlName: ${guildUrlName}, timeStamp: ${timeStamp} }`
    })
  }

  const recoveredAddressFromMessage = ethers.utils.verifyMessage(
    createMessage(guildUrlName, timeStamp),
    signature
  )
  if (recoveredAddressFromMessage.toLowerCase() !== address.toLowerCase()) {
    return res.status(400).send({
      error:
        'Address recovered form message/signature does not match address given'
    })
  }

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
      .setHeader('Set-Cookie', `authToken="${authToken}"; HttpOnly;`)
      .send({ message: 'Successfully signed in' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
