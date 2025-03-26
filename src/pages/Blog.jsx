import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreatePost } from '../components/CreatePost'
import { PostFilter } from '../components/PostFilter'
import { PostSorting } from '../components/PostSorting'
import { PostList } from '../components/PostList'
import { getPosts } from '../api/posts'
import { Header } from '../components/Header'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts(),
  })

  const posts = postQuery.data ?? []

  return (
    <div className='max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl'>
      <Header />
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Blog</h1>

      <CreatePost />

      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-700'>Filters</h2>
        <PostFilter
          field='author'
          value={author}
          onChange={(value) => setAuthor(value)}
        />
      </div>

      <div className='mt-4'>
        <h2 className='text-lg font-semibold text-gray-700'>Sorting</h2>
        <PostSorting
          fields={['createdAt', 'updatedAt']}
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          orderValue={sortOrder}
          onOrderChange={(orderValue) => setSortOrder(orderValue)}
        />
      </div>

      <hr className='my-6 border-gray-300' />

      <PostList posts={posts} />
    </div>
  )
}
