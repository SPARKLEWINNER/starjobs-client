// import * as React from 'react'
import PropTypes from 'prop-types'

const Seo = ({title = 'Starjobs', children}) => {
  const defaultTitle = 'Starjobs'
  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {children}
    </>
  )
}

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element
}

export default Seo
