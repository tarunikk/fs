const Persons = ({ personsToShow, removePerson}) => 
  personsToShow.map((person) => (
    <p key={person.id} >
      {person.name} {person.number}
      <button onClick={() => removePerson(person)}>Delete</button>
    </p>
  )
)

export default Persons