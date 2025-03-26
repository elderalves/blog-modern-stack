import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }

    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (error) {
      console.error('error getting posts:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      return res.json(post)
    } catch (error) {
      console.error('error creating post:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params

    try {
      const post = await getPostById(id)

      if (!post) {
        return res.status(404).json({ error: 'post not found' })
      }

      return res.json(post)
    } catch (error) {
      console.error('error getting post by id:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (error) {
      console.error('error updating post:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (error) {
      console.error('error deleting post:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })
}
