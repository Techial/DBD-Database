import express from 'express'

// Project imports
import { statsModel } from '../db/models/stats.js'
import Prettify from '../utils/prettify.js'

const numFormatter = Intl.NumberFormat('en', { notation: 'compact' });

async function handleRead (req, res) {
  const endpoint = req.query?.endpoint || '*' // If endpoint isn't supplied, assume request is for Global

  try {
    const stats = await statsModel.findOne({ name: endpoint })
    res.status(200).send(Prettify._JSON({
      schemaVersion: 1,
      label: 'Queries handled',
      message: numFormatter.format(stats.queries).toString(),
      color: 'success',
      style: 'flat-square'
    }))
  } catch (error) {
    res.status(500).send(Prettify._JSON({ error }))
  }
}

export default (parentPath = '/') => {
  // Create new router
  const router = express.Router()

  // Only READ (GET) until we have auth in place
  router.get(`${parentPath}stats_badge`, handleRead)

  // Return router for Express to use as Middleware
  return router
}
