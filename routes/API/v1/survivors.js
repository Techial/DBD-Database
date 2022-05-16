import express from 'express'

// Create new router
const router = express.Router()

// Project imports
import { Survivor } from '../../../db/models/character.js'
import Prettify from '../../../utils/prettify.js'

function handleRead (req, res) {
  const query = req.query
  Survivor.find(query).then((survivor) => {
    try {
      res.status(200).send(Prettify._JSON({ survivors: survivor }))
    } catch (error) {
      res.status(500).send(Prettify._JSON({ error }))
    }
  })
}

// Only READ (GET) until we have auth in place
router.get(`/survivors`, handleRead)

// Return router for Express to use as Middleware
export default router
