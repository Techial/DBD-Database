const {survivorPerk} = require('../../../db/schemes/perk');

function handleRead(req, res) {
    var query = req.query;
    survivorPerk.find(query).then((sPerk) => {
        try {
            res.status(200).send({perks: sPerk});
        } catch(error) {
            res.status(500).send({error: error});
        }
    });
}

module.exports = (app, jsonParser) => {
    // Only READ (GET) until we have auth in place
    app.get('/API/1.0/survivor_perks', handleRead);
};