const perkJobs = require('./jobs/perk_jobs')
const DBI = require('./db/db')

// Open connection if not already connected
DBI.initConnection()

// Update perks after app is built, instead of every time the dyno starts
perkJobs.updateKillerAndSurvivorPerks().then(() => process.exit(0))
// Close process to stop it from launching server.