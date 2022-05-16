import express from 'express'

// Project imports
import { survivorPerk } from '../../../db/models/perk.js'
import Prettify from '../../../utils/prettify.js'

// Create new router
const router = express.Router()

function handleRead (req, res) {
  const query = req.query
  survivorPerk.find(query).then((sPerk) => {
    try {
      res.status(200).send(Prettify._JSON({ perks: sPerk }))
    } catch (error) {
      res.status(500).send(Prettify._JSON({ error }))
    }
  })
}

// Only READ (GET) until we have auth in place
router.get('/survivor_perks', handleRead)

// Return router for Express to use as Middleware
export default router
