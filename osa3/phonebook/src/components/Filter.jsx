const Filter = ({ newFilter, setNewFilter }) => {
  return (
    <div>
      filter shown with 
        <input value={newFilter} onChange={(event) => setNewFilter(event.target.value)} />
    </div>
  )
} 

export default Filter