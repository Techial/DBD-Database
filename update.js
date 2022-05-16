import perkJobs from './jobs/perk_jobs.js'
import charJobs from './jobs/char_jobs.js'
import DBI from './db/db.js'

// Open connection if not already connected
DBI.initConnection()

// Keep this for later, as we're going to add more scraping to our DB
let perksUpdated; let charactersUpdated = false

function closeProcess () {
  if (perksUpdated && charactersUpdated) {
    console.log('Database update finished.')
    process.exit(0)
  }
}

// Update perks after app is built & every hour, instead of every time the dyno starts

// Update characters first
charJobs.updateKillersAndSurvivors().then(res => {
  console.log(res)
  charactersUpdated = true

  // Then upgrade perks
  perkJobs.updateKillerAndSurvivorPerks().then(res => {
    console.log(res)
    perksUpdated = true
    closeProcess()
  })
})
// Close process to stop it from launching server.
