const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')

const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const morgan = require('morgan')

const mongoUri = config.MONGODB_URI

mongoose.connect(mongoUri)

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/blogs', blogsRouter)

module.exports = app