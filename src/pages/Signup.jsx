import { useState } from 'react'
// import { useMutation } from '@tanstack/react-query'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useNavigate, Link } from 'react-router-dom'
// import { signup } from '../api/users'
import { SIGNUP_USER } from '../api/graphl/users'

export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // const signupMutation = useMutation({
  //   mutationFn: () => signup({ username, password }),
  //   onSuccess: () => navigate('/login'),
  //   onError: () => alert('Failed to create user, please try again'),
  // })

  const [signupUser, { loading }] = useGraphQLMutation(SIGNUP_USER, {
    variables: { username, password },
    onCompleted: () => {
      navigate('/login')
    },
    onError: () => {
      alert('Failed to create user, please try again')
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    // signupMutation.mutate()
    signupUser()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <br />
      <div>
        <label htmlFor='create-username'>Username: </label>
        <input
          type='text'
          name='create-username'
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
          id='create-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-username'>Password: </label>
        <input
          type='password'
          name='create-password'
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
          id='create-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Signing up...' : 'Sign up'}
        disabled={!username || !password || loading}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      />
    </form>
  )
}
