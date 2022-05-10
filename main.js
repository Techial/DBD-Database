// const perkJobs = require('./jobs/perk_jobs')
// const schedule = require('node-schedule')
import DBI from './db/db.js'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import { statsModel } from './db/models/stats.js'
import mongoSanitize from 'express-mongo-sanitize'

// Use router provided by the routes in V1
import killerRouter from './routes/API/v1/killer_perks.js'

import survivorRouter from './routes/API/v1/survivor_perks.js'
/// ///////////////////////////

/// ///////////////////////////
//          Stats           //
import statsRouter from './routes/stats.js'

const app = express()
const port = process.env.PORT || 80

// Open connection if not already connected
DBI.initConnection()

app.use(bodyParser.urlencoded({ extended: true }))

// Allow Cross-origin
app.use(cors())

// Use Express compression
app.use(compression())

// Sanitize all user input for MongoDB
// Removes $ and . characters from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(mongoSanitize())

// Middleware for setting header response to JSON
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json') // Set header response to JSON, to prevent it from trying to render HTML in data
  return next() // Goto next middleware / route
})

// Middleware for recording number of queries handled
// by application
//
// NO INFORMATION ABOUT USER IS STORED
app.use(async (req, res, next) => {
  const path = req.path // Record path now in case next Middleware changs it somehow
  next() // Go to next Middleware

  // Record Global stats
  statsModel.updateOne({ name: '*' }, {
    $inc: { queries: 1 },
    lastUpdated: new Date() // new Date() instead of Date.now() so it will work with toLocaleString()
  }, { upsert: true }).exec()

  if (path === '*') { return } // Don't record local stats for Global

  // Record endpoint stats
  statsModel.updateOne({ name: path }, {
    $inc: { queries: 1 },
    lastUpdated: new Date() // new Date() instead of Date.now() so it will work with toLocaleString()
  }, { upsert: true }).exec()
})

/// ///////////////////////////
//          V1 API          //
const V1 = '/API/V1/'
app.use(
  killerRouter(V1) // Killer perks
)
app.use(
  survivorRouter(V1) // Survivor perks
)
app.use(
  statsRouter() // Query Stats
)

// Open listening port for Express
app.listen(port, () => {
  console.log(`Webserver started on port ${port}`)
})

// Schedule update for every hour
// schedule.scheduleJob('0 * * * *', () => {
//  perkJobs.updateKillerAndSurvivorPerks()
// })
