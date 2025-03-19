import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []

  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose! From Jest',
      author: 'Daniel Bugl',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)

    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      content: 'Post with no title',
      tags: ['empty'],
    }

    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Minimal Post',
    }

    const createdPost = await createPost(post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )

    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )

    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toEqual(3)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toEqual(1)
  })
})

describe('getting a post', () => {
  test('should return a post by id', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const post = await getPostById(nonExistentId)
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })

  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updateAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const post = await updatePost(nonExistentId, { author: 'Test Author' })
    expect(post).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const result = await deletePost(nonExistentId)
    expect(result.deletedCount).toEqual(0)
  })
})

const samplePosts = [
  {
    title: 'Learning Redux',
    author: 'Daniel Bugl',
    tags: ['redux'],
  },
  {
    title: 'Learning React Hooks',
    author: 'Daniel Bugl',
    tags: ['react'],
  },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  {
    title: 'Guide to Typescript',
  },
]
