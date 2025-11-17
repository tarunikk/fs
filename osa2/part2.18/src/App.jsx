import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countriesToShow }) => {
    return (
      <ul>
        {countriesToShow.map(country => 
          <Country
            name={country.name} />
        )}
      </ul> 
    )
  }

const Country = ({ info }) => {
return (
    <li>
        {info.name}
    </li>
)
}  

const App = () => {
    const [countries, setCountries] = useState ([])
    const [info, setInfo] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [country, setCountry] = useState(null)

    useEffect(() => {
      console.log('effect run, country is now', country)
  
      // skip if country is not defined
      if (country) {
        console.log('fetching info on country')
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
          .then(response => {
            console.log(response.data)
            setInfo(response.data)
          })
      }
    }, [country])

    const handleChange = (event) => {
        event.preventDefault()
        setNewFilter(event.target.newFilter)
    }

    const onSearch = (event) => {
        event.preventDefault()
        setCountry(value)
    }

    const countriesToShow = newFilter 
    ? countries.filter(country => country.name.toLowerCase().includes(newFilter.toLowerCase()) === true)
    : countries

    return (
    <div>
        <Filter newFilter={newFilter} handleChange={handleChange} />
        <Countries countriesToShow={countriesToShow} />
    </div>
    )
}

export default App