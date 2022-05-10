const express = require('express');

// Project imports
const {killerPerk} = require('../../../db/models/perk');
const Prettify = require('../../../utils/prettify');

function handleRead(req, res) {
    var query = req.query;
    killerPerk.find(query).then((kPerk) => {
        try {
            res.status(200).send(Prettify._JSON({perks: kPerk}));
        } catch(error) {
            res.status(500).send(Prettify._JSON({error: error}));
        }
    });
}

module.exports = (parentPath) => {
    // Create new router
    const router = express.Router();

    // Only READ (GET) until we have auth in place
    router.get(`${parentPath}killer_perks`, handleRead);

    // Return router for Express to use as Middleware
    return router;
};