import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch= useDispatch()

  const handleChange = (event) => {
    console.log(event.target.value)
    const newFilter = event.target.value
    dispatch(filterChange(newFilter))
    // input-kentän arvo muuttujassa event.target.value
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input name= "newfilter" onChange={handleChange} />
    </div>
  )
}

export default Filter