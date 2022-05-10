import perkJobs from './jobs/perk_jobs.js'
import DBI from './db/db.js'

// Open connection if not already connected
DBI.initConnection()

// Update perks after app is built, instead of every time the dyno starts
perkJobs.updateKillerAndSurvivorPerks().then(res => {
  console.log(res)
  process.exit(0)
})
// Close process to stop it from launching server.
