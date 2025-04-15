import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

postsRoutes(app)
userRoutes(app)
eventRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

// Add a health check endpoint for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

export { app }
