import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Post } from '../components/Post'
import { getPostById } from '../api/posts'
import { getUserInfo } from '../api/users'

function truncate(str, max = 160) {
  return str.length > max ? str.slice(0, max) + '...' : str
}

export function ViewPost({ postId }) {
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })

  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })

  const userInfo = userInfoQuery.data ?? {}

  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:title' content={post.title} />
          <meta property='og:description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.name} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {post ? <Post {...post} fullPost /> : `Post with id ${postId} not found`}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
