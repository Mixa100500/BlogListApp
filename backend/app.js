const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./conrtollers/blogs')
const logger = require('./utils/logger')
const usersRouter = require('./conrtollers/users')
const mongoose = require('mongoose')
const loginRouter = require('./conrtollers/login')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)
logger.info('connected to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if( process.env.NODE_ENV === 'test') {
  const testingRouter = require('./conrtollers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unkownEndpoint)
app.use(middleware.errorHandle)

module.exports = app