import mongoose from 'mongoose'
const Schema = mongoose.Schema

const survivorModel = new Schema({
  name: { type: String, required: true, unique: true },
  URIName: { type: String, required: true, unique: true },
  iconURL: { type: String, required: true },
  link: { type: String, required: true }
})

const killerModel = new Schema({
  name: { type: String, required: true, unique: true },
  killerName: { type: String, required: true, unique: true },
  URIName: { type: String, required: true, unique: true },
  iconURL: { type: String, required: true },
  link: { type: String, required: true }
})

// const characterData = { name: characterName, URIName, iconURL: characterImage, link: characterLink}

export const Survivor = mongoose.model('survivor', survivorModel)
export const Killer = mongoose.model('killer', killerModel)
