import express from 'express'

import KillerPerksRouter from './V1/killer_perks.js'
import SurvivorPerksRouter from './V1/survivor_perks.js'

import KillersRouter from './V1/killers.js'
import SurvivorsRouter from './V1/survivors.js'

const V1 = '/API/V1'

// Create new router
const router = express.Router()

router.use(V1, KillerPerksRouter)
router.use(V1, SurvivorPerksRouter)

router.use(V1, KillersRouter)
router.use(V1, SurvivorsRouter)

// Return router for Express to use as Middleware
export default router
