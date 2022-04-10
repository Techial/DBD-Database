const perkJobs      = require("./jobs/perk_jobs");
const DBI           = require("./db/db");
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const port          = process.env.PORT || 80;
const schedule      = require("node-schedule");

app.use(bodyParser.urlencoded({extended: true}));
var jsonParser = bodyParser.json();

var cors = require("cors");
app.use(cors());

DBI.initConnection();

require("./routes/API/1.0/killer_perks")(app, jsonParser);
require("./routes/API/1.0/survivor_perks")(app, jsonParser);

app.listen(port, () => {
    console.log(`Webserver started on port ${port}`);
});

// Update when app starts
perkJobs.updateKillerAndSurvivorPerks();

// Schedule update for every 2 hours
schedule.scheduleJob("0 */2 * * *", () => {
    perkJobs.updateKillerAndSurvivorPerks();
});