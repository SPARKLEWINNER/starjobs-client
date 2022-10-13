const path = require('path')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  siteMetadata: {
    title: `Starjobs`,
    author: `Sparkle Star International`,
    description: `A starter blog demonstrating what Gatsby can do.`
  },
  plugins: [
    `gatsby-plugin-resolve-src`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, 'src', 'assets/images')
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Starjobs`,
        short_name: `Starjobs`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#0d7bc9`,
        display: `standalone`,
        icon: `src/assets/images/gatsby-icon.png` // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-offline`
  ]
}
