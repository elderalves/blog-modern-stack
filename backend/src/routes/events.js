import {
  trackEvent,
  getTotalViews,
  getDailyDurations,
  getDailyViews,
} from '../services/events.js'
import { getPostById } from '../services/posts.js'

export function eventRoutes(app) {
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action } = req.body
      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const event = await trackEvent({
        postId,
        session,
        action,
      })

      return res.json({ session: event.session })
    } catch (error) {
      console.error(error)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const stats = await getTotalViews(post._id)

      return res.json(stats)
    } catch (error) {
      console.error('error getting stats', error)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()

      const stats = await getDailyViews(post._id)
      return res.json(stats)
    } catch (error) {
      console.error('error getting daily views', error)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()

      const stats = await getDailyDurations(post._id)
      return res.json(stats)
    } catch (error) {
      console.error('error getting daily durations', error)
      return res.status(500).end()
    }
  })
}
