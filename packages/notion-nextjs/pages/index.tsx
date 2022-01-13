import { GetServerSideProps } from 'next'
import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'
import { ensureAuthTokenHasAccessToGuild } from '../lib/ensureAuthTokenHasAccessToGuild'
import { redirectSignIn } from '../lib/redirectSignIn'

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('req: ', context.req)
  const authToken = context.req?.cookies?.authToken
  const host = context.req.headers.host
  if (!authToken || !host) {
    return redirectSignIn()
  }

  try {
    await ensureAuthTokenHasAccessToGuild(authToken)
  } catch (e) {
    console.error(e)
    return redirectSignIn()
  }

  try {
    const props = await resolveNotionPage(domain)

    return { props }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
