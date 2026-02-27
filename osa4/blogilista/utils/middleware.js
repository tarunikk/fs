const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  logger.info('token:', request.get('authorization'))
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  logger.info('token:', request.get('authorization'))
  if (authorization && authorization.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(authorization.replace('Bearer ', ''), process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    logger.info('user:', request.user)
    logger.info('userid:', request.user.id)
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'ValidationError' && error.message.includes('User validation failed: username: Path `username` is required.')) {
    return response.status(400).json({ error: 'Username is required' })
  } else if (error.name === 'ValidationError' && error.message.includes('User validation failed: username')) {
    return response.status(400).json({ error: 'expected `username` to be at least 3 char long' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}