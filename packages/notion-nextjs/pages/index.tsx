import { GetServerSideProps } from 'next'
import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('req: ', context.req)
  const authToken = context.req?.cookies?.authToken
  if (!authToken) {
    return {
      redirect: {
        permanent: false,
        destination: `/sign-in`
      }
    }
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
