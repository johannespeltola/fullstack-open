// Error handler with support for status based errors
const errorHandler = ((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  res.status(err.status || 500).json({ error: err.message })
})

module.exports = { errorHandler }
