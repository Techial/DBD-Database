const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const PerkSchema = new Schema({
    URI_name: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    iconURL: {type: String, required: true},
    characterName: {type: String, required: true},
    characterURL: {type: String, required: true},
    characterImageURL: {type: String, required: true},
    content: {type: String, required: true}
});

module.exports = {
    "survivorPerk": mongoose.model('survivorPerk', PerkSchema),
    "killerPerk": mongoose.model('killerPerk', PerkSchema),
};