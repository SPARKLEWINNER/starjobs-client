const queryString = require('query-string')

const url_search = (location) => {
  return queryString.parse(location)
}

export {url_search}
