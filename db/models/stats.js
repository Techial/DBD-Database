const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stats_model = new Schema({
    name: {type: String, required: true, unique: true},
    queries: {type: Number, default: 0},
    last_updated: {type: Date}
});

module.exports = {
    "stats_model": mongoose.model('stats', stats_model),
};