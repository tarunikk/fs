import { useState, useEffect } from 'react'
// import axios from 'axios'
import countryService from './services/countries'

const App = () => {
    const [countries, setCountries] = useState ([])
    // const [info, setInfo] = useState('')
    const [newFilter, setNewFilter] = useState('')
    // const [country, setCountry] = useState(null)

    useEffect(() => {
      // console.log('effect run, country is now', country)
      countryService
        .getAll()
        .then(response => {
        console.log('promise fulfilled')
        console.log('country names: ', response.data.map(country => country.name.common))
        setCountries(response.data.map(country => country.name.common))
      })
    }, [])

    const Countries = ({ countriesToShow }) => {
      console.log(countriesToShow)
      if (countriesToShow.length > 10) {
        return (
          <div>
            <p>Too many matchws, specify another filter</p>
          </div>
        )
      }
        return (
          <ul>
            {countriesToShow.map(country => 
              <li>{country}</li>
            )}
          </ul> 
        )
      }

    /**
    const Country = ({ info }) => {
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
      return (
          <li>
              {info.name}
          </li>
      )
    }  
    
    const onSearch = (event) => {
        event.preventDefault()
        setCountry(value)
    }  */

    const Filter = ({ newFilter, handleFilterChange }) => {
      return (
        <div>
          filter shown with 
            <input value={newFilter} onChange={handleFilterChange} />
        </div>
      )
    } 
    const countriesToShow = newFilter 
      ? countries.filter(country => country.toLowerCase().includes(newFilter.toLowerCase()) === true)
      : countries

    const handleFilterChange = (event) => {
        console.log(event.target.value)
        setNewFilter(event.target.value)
    }

    return (
    <div>
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      </div>
        <Countries countriesToShow={countriesToShow} />
    </div>
    )
}

export default App