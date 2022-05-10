const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statsModel = new Schema({
  name: { type: String, required: true, unique: true },
  queries: { type: Number, default: 0 },
  last_updated: { type: Date }
})

module.exports = {
  statsModel: mongoose.model('stats', statsModel)
}
