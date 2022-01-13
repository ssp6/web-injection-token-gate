import { GetServerSideProps } from 'next'
import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authToken = context.req?.cookies?.authToken
  if (!authToken) {
    return {
      redirect: {
        permanent: false,
        destination: `/sign-in`
      }
    }
  }

  const rawPageId = context.params.pageId as string

  if (rawPageId === 'sitemap.xml' || rawPageId === 'robots.txt') {
    return {
      redirect: {
        permanent: false,
        destination: `/api/${rawPageId}`
      }
    }
  }

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}
