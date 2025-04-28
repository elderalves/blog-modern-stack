import { useLoaderData } from 'react-router-dom'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { ViewPost } from './pages/ViewPost'
import { getPostById, getPosts } from './api/posts'
import { getUserInfo } from './api/users'

export const routes = [
  {
    path: '/',
    loader: async () => {
      const queryClient = new QueryClient()
      const author = ''
      const sortBy = 'createdAt'
      const sortOrder = 'descending'
      const posts = await getPosts({ author, sortBy, sortOrder })

      await queryClient.prefetchQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => posts,
      })

      const uniqueAuthors = posts
        .map((post) => post.author)
        .filter((value, index, array) => array.indexOf(value) === index)

      for (const userId of uniqueAuthors) {
        await queryClient.prefetchQuery({
          queryKey: ['users', userId],
          queryFn: () => getUserInfo(userId),
        })
      }

      return dehydrate(queryClient)
    },
    Component() {
      const dehydratedState = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <Blog />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/posts/:postId/:slug?',
    loader: async ({ params }) => {
      const postId = params.postId
      const queryClient = new QueryClient()
      const post = await getPostById(postId)

      await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => post,
      })

      if (post?.author) {
        await queryClient.prefetchQuery({
          queryKey: ['users', post.author],
          queryFn: () => getUserInfo(post.author),
        })
      }

      return {
        dehydrateState: dehydrate(queryClient),
        postId,
      }
    },
    Component() {
      const { dehydrateState, postId } = useLoaderData()

      return (
        <HydrationBoundary state={dehydrateState}>
          <ViewPost postId={postId} />
        </HydrationBoundary>
      )
    },
  },
]
