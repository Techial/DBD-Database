// const perkJobs = require('./jobs/perk_jobs')
// const schedule = require('node-schedule')
const DBI = require('./db/db')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 80
const compression = require('compression')
const cors = require('cors')
const { statsModel } = require('./db/models/stats')

// Open connection if not already connected
DBI.initConnection()

app.use(bodyParser.urlencoded({ extended: true }))

// Allow Cross-origin
app.use(cors())

// Use Express compression
app.use(compression())

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
    last_updated: new Date() // new Date() instead of Date.now() so it will work with toLocaleString()
  }, { upsert: true }).exec()

  if (path === '*') { return } // Don't record local stats for Global

  // Record endpoint stats
  statsModel.updateOne({ name: path }, {
    $inc: { queries: 1 },
    last_updated: new Date() // new Date() instead of Date.now() so it will work with toLocaleString()
  }, { upsert: true }).exec()
})

/// ///////////////////////////
//          V1 API          //
const V1 = '/API/V1/'

// Use router provided by the routes in V1
app.use(
  require('./routes/API/v1/killer_perks')(V1) // Killer perks
)

app.use(
  require('./routes/API/v1/survivor_perks')(V1) // Survivor perks
)
/// ///////////////////////////

/// ///////////////////////////
//          Stats           //
app.use(
  require('./routes/stats')()
)

// Open listening port for Express
app.listen(port, () => {
  console.log(`Webserver started on port ${port}`)
})

// Schedule update for every 2 hours
// schedule.scheduleJob('0 */2 * * *', () => {
//  perkJobs.updateKillerAndSurvivorPerks()
// })
