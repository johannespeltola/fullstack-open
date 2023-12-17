const sensitiveUrls = ['/api/users', '/api/login']

const routeIsSensitive = (path) => {
  return sensitiveUrls.some((e) => e === path.substring(0, e.length))
}

module.exports = {
  routeIsSensitive
}