/* eslint-disable indent */
// Error handler with support for status based errors
const errorHandler = ((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  switch (err.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).json({ error: err.message })
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'invalid token' })
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'token expired' })
  }

  res.status(err.status || 500).json({ error: err.message })
})

module.exports = { errorHandler }
