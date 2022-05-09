const perkJobs      = require("./jobs/perk_jobs");
const DBI           = require("./db/db");
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const port          = process.env.PORT || 80;
const schedule      = require("node-schedule");
const compression   = require("compression");

app.use(bodyParser.urlencoded({extended: true}));

// Allow Cross-origin
var cors = require("cors");
app.use(cors());

// Use Express compression
app.use(compression());

// Open connection if not already connected
DBI.initConnection();

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json'); // Set header response to JSON, to prevent it from trying to render HTML in data
    return next(); // Goto next middleware / route
});

//////////////////////////////
//          V1 API          //
const V1 = "/API/V1/";

// Use router provided by the routes in V1
app.use(
    require("./routes/API/v1/killer_perks")(V1) // Killer perks
);

app.use(
    require("./routes/API/v1/survivor_perks")(V1) // Survivor perks
);
//////////////////////////////


// Open listening port for Express
app.listen(port, () => {
    console.log(`Webserver started on port ${port}`);
});

// Update perks when app starts
perkJobs.updateKillerAndSurvivorPerks();

// Schedule update for every 2 hours
schedule.scheduleJob("0 */2 * * *", () => {
    perkJobs.updateKillerAndSurvivorPerks();
});