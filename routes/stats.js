const express = require('express')

// Project imports

const { statsModel } = require('../db/models/stats')
const Prettify = require('../utils/prettify')

async function handleRead (req, res) {
  const endpoint = req.query?.endpoint || '*' // If endpoint isn't supplied, assume request is for Global

  try {
    const stats = await statsModel.findOne({ endpoint })
    res.status(200).send(Prettify._JSON({
      schemaVersion: 1,
      label: 'Queries handled',
      message: stats.queries.toString(),
      color: 'green'
    }))
  } catch (error) {
    res.status(500).send(Prettify._JSON({ error }))
  }
}

module.exports = (parentPath = '/') => {
  // Create new router
  const router = express.Router()

  // Only READ (GET) until we have auth in place
  router.get(`${parentPath}stats_badge`, handleRead)

  // Return router for Express to use as Middleware
  return router
}
