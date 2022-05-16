import mongoose from 'mongoose'
const Schema = mongoose.Schema

const survivorPerkModel = new Schema({
  URIName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconURL: { type: String, required: true },
  character: { type: Schema.Types.ObjectId, ref: 'survivor' },
  characterName: { type: String, required: true },
  content: { type: String, required: true },
  contentText: { type: String, required: true }
})

const killerPerkModel = new Schema({
  URIName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconURL: { type: String, required: true },
  character: { type: Schema.Types.ObjectId, ref: 'killer' },
  characterName: { type: String, required: true },
  content: { type: String, required: true },
  contentText: { type: String, required: true }
})

export const survivorPerk = mongoose.model('survivorPerk', survivorPerkModel)
export const killerPerk = mongoose.model('killerPerk', killerPerkModel)
