import express from 'express'

// Project imports
import { killerPerk } from '../../../db/models/perk.js'
import Prettify from '../../../utils/prettify.js'

function handleRead (req, res) {
  const query = req.query
  killerPerk.find(query).then((kPerk) => {
    try {
      res.status(200).send(Prettify._JSON({ perks: kPerk }))
    } catch (error) {
      res.status(500).send(Prettify._JSON({ error }))
    }
  })
}

export default (parentPath = '/') => {
  // Create new router
  const router = express.Router()

  // Only READ (GET) until we have auth in place
  router.get(`${parentPath}killer_perks`, handleRead)

  // Return router for Express to use as Middleware
  return router
}
