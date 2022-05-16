import express from 'express'

// Create new router
const router = express.Router()

// Project imports
import { Killer } from '../../../db/models/character.js'
import Prettify from '../../../utils/prettify.js'

function handleRead (req, res) {
  const query = req.query
  Killer.find(query).then((killer) => {
    try {
      res.status(200).send(Prettify._JSON({ killers: killer }))
    } catch (error) {
      res.status(500).send(Prettify._JSON({ error }))
    }
  })
}

// Only READ (GET) until we have auth in place
router.get(`/killers`, handleRead);

// Return router for Express to use as Middleware
export default router;
