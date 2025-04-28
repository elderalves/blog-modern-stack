import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post'

export function PostList({ posts = [] }) {
  return (
    <div className='mt-6 space-y-6'>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post {...post} />
          <hr className='border-gray-300' />
        </Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
