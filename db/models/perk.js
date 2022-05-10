const mongoose = require('mongoose')
const Schema = mongoose.Schema

const perkModel = new Schema({
  URI_name: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconURL: { type: String, required: true },
  characterName: { type: String, required: true },
  characterURL: { type: String, required: true },
  characterImageURL: { type: String, required: true },
  content: { type: String, required: true }
})

module.exports = {
  survivorPerk: mongoose.model('survivorPerk', perkModel),
  killerPerk: mongoose.model('killerPerk', perkModel)
}
