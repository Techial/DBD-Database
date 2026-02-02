import perkJobs from './jobs/perk_jobs.js'
import charJobs from './jobs/char_jobs.js'
import DBI from './db/db.js'

// Open connection and wait for it to be ready
DBI.initConnection()

async function runUpdate () {
  // Wait for database connection to be ready
  await DBI.waitForConnection()

  // Update characters first
  const charRes = await charJobs.updateKillersAndSurvivors()
  console.log(charRes)

  // Then update perks
  const perkRes = await perkJobs.updateKillerAndSurvivorPerks()
  console.log(perkRes)

  console.log('Database update finished.')
  process.exit(0)
}

runUpdate().catch(err => {
  console.error('Update failed:', err)
  process.exit(1)
})
