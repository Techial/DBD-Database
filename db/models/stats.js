import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Model = new Schema({
  name: { type: String, required: true, unique: true },
  queries: { type: Number, default: 0 },
  lastUpdated: { type: Date }
})

export const statsModel = mongoose.model('stats', Model)
