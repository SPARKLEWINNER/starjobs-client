// import * as React from 'react'

import Seo from 'components/seo'

const NotFoundPage = () => {
  return (
    <>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
