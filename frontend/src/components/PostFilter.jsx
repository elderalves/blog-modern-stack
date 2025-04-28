import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
  return (
    <div className='flex flex-col space-y-2'>
      <label htmlFor={`filter-${field}`} className='text-gray-600 font-medium'>
        {field}:
      </label>
      <input
        type='text'
        name={`filter-${field}`}
        id={`filter-${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
      />
    </div>
  )
}

PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
