import dotenv from 'dotenv'

dotenv.config()

import { initDatabase } from './src/db/init.js'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/event.js'
import { createUser } from './src/services/users.js'
import { createPost } from './src/services/posts.js'
import { trackEvent } from './src/services/events.js'

const simulationStart = Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 days ago
const simulationEnd = Date.now()

const simulateUsers = 5
const simulatePosts = 10
const simulateViews = 10000

async function simulateEvents() {
  const connection = await initDatabase()

  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulateUsers)
      .fill(null)
      .map(async (_, u) => {
        return await createUser({
          username: `user-${u}`,
          password: `password-${u}`,
        })
      }),
  )
  console.log('Created users:', createdUsers.length)

  await Post.deleteMany({})
  const createPosts = await Promise.all(
    Array(simulatePosts)
      .fill(null)
      .map(async (_, p) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)]

        return await createPost(randomUser._id, {
          title: `Test Post ${p}`,
          contents: `Content for post ${p}`,
        })
      }),
  )
  console.log('Created posts:', createPosts.length)

  await Event.deleteMany({})
  const createdViews = await Promise.all(
    Array(simulateViews)
      .fill(null)
      .map(async () => {
        const randomPost =
          createPosts[Math.floor(Math.random() * createPosts.length)]
        const sessionStart =
          simulationStart + Math.random() * (simulationEnd - simulationStart)
        const sessionEnd =
          sessionStart + 1000 * Math.floor(Math.random() * 60 * 5)

        const event = await trackEvent({
          postId: randomPost._id,
          action: 'startView',
          date: new Date(sessionStart),
        })

        await trackEvent({
          postId: randomPost._id,
          session: event.session,
          action: 'endView',
          date: new Date(sessionEnd),
        })
      }),
  )

  console.log(`successfully simulated ${createdViews.length} views`)

  await connection.disconnect()
}

simulateEvents()
