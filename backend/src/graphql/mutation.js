import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'

export const mutationSchema = `#graphql
  type Mutation {
    signupUser(username: String!, password: String!): User
    loginUser(username: String!, password: String!): String
    createPost(title: String!, contents: String, tags: [String!]): Post
  }
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      const user = await createUser({ username, password })
      if (!user) {
        throw new GraphQLError('Username already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return user
    },
    loginUser: async (parent, { username, password }) => {
      const token = await loginUser({ username, password })
      if (!token) {
        throw new GraphQLError('Invalid username or password', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      return token
    },
    createPost: async (parent, { title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action',
          {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          },
        )
      }
      return await createPost(auth.sub, { title, contents, tags })
    },
  },
}
