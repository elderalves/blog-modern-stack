import PropTypes from 'prop-types'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <div className='flex flex-col space-y-4'>
      <div>
        <label htmlFor='sortBy' className='text-gray-600 font-medium'>
          Sort By:
        </label>
        <select
          name='sortBy'
          id='sortBy'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor='sortOrder' className='text-gray-600 font-medium'>
          Sort Order:
        </label>
        <select
          name='sortOrder'
          id='sortOrder'
          value={orderValue}
          onChange={(e) => onOrderChange(e.target.value)}
          className='ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
        >
          <option value='ascending'>Ascending</option>
          <option value='descending'>Descending</option>
        </select>
      </div>
    </div>
  )
}

PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}
