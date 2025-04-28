import PropTypes from 'prop-types'
import slug from 'slug'
import { Link } from 'react-router-dom'
import { User } from './User'

export function Post({ title, contents, author, id, fullPost = false }) {
  return (
    <article className='p-6 bg-white shadow-md rounded-lg border border-gray-200'>
      {fullPost ? (
        <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
        </Link>
      )}
      {fullPost && <div className='mt-2 text-gray-700'>{contents}</div>}
      {author && (
        <p className='mt-3 text-gray-600'>
          <strong>Written by:</strong> <User {...author} />
        </p>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
