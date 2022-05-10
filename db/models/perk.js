import mongoose from 'mongoose'
const Schema = mongoose.Schema

const perkModel = new Schema({
  URIName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconURL: { type: String, required: true },
  characterName: { type: String, required: true },
  characterURL: { type: String, required: true },
  characterImageURL: { type: String, required: true },
  content: { type: String, required: true },
  contentText: { type: String, required: true }
})

export const survivorPerk = mongoose.model('survivorPerk', perkModel)
export const killerPerk = mongoose.model('killerPerk', perkModel)
