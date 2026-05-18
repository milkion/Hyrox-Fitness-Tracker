// Express app setup here (not listening)
import express from 'express'
import { authRouter } from './routes/auth'
import { planRouter } from './routes/plan'

const app = express()
app.use(express.json())

// mount the router
app.use('/auth/', authRouter)
app.use('/plans', planRouter)

export default app
