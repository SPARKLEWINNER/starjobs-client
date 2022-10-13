const path = require('path')

// Create dynamic routing for products
exports.onCreatePage = ({page, actions}) => {
  const {createPage} = actions
  if (page.path === `/`) {
    page.matchPath = `/*`
    createPage(page)
  }
}

exports.onCreateWebpackConfig = ({stage, actions, getConfig}) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      resolve: {
        modules: [path.resolve(__dirname, 'src'), path.join(__dirname, 'src', 'components'), 'node_modules']
      },
      externals: getConfig().externals.concat(function (context, request, callback) {
        const regex = /^@?firebase(\/(.+))?/
        // exclude firebase products from being bundled, so they will be loaded using require() at runtime.
        if (regex.test(request)) {
          return callback(null, 'umd ' + request)
        }
        callback()
      })
    })
  }
}
