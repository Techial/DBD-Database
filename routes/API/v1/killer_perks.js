const {killerPerk} = require('../../../db/schemes/perk');
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

module.exports = (app, jsonParser) => {
    // Only READ (GET) until we have auth in place
    app.get('/API/1.0/killer_perks', handleRead);
};