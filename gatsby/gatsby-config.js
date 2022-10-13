const path = require('path')

require('dotenv').config({
  path: `.env.development`
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
        icon: `src/assets/static/favicon/icon-48x48.png` // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [`https://fonts.googleapis.com`, `https://fonts.gstatic.com`],
        web: [
          {
            name: `Public Sans`,
            file: `https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap`
          }
        ]
      }
    }
  ]
}
