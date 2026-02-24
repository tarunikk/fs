import { useState, useEffect } from 'react'
import axios from 'axios'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [info, setInfo] = useState([])
  const [value, setValue] = useState('')
  const [country, setCountry] = useState(null)
  
  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
      console.log('promise fulfilled')
      setCountries(response.data.map(country => country.name.common))
    })
  }, [])

  useEffect(() => {
    if (country){
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
        console.log('promise fulfilled')
        console.log('country selected: ', response.data.name.common)
        setInfo(response.data)
        console.log('country info: ', JSON.stringify(response.data))
    })
  }
  }, [country])

  const Countries = ({ countriesToShow }) => {
    console.log('countries to show: ', countriesToShow)
    if (countriesToShow.length > 10) {
      return (
        <div>
          <p>Too many matches, specify another filter</p>
        </div>
      )
    }
    if (countriesToShow.length === 1) {
      setCountry(countriesToShow[0])
      console.log('found one country: ', country)
      return (
      <div>
          <Country
            country={country} 
            info={info}
          />
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

  const Country = ({ country, info }) => {
    console.log(country)
    console.log(info.capital)
    const languages = Object.values(info.languages)
    console.log('languages: ',languages)
    return (
      <div>
        <h2>{country}</h2>
        <p>Capital {info.capital}</p>
        <p>Area {info.area}</p>
        <h2>Languages</h2>
        <ul>
          {languages.map(lang =>
              <li>{lang}</li>
          )}
        </ul>
      </div>
    )
  }

  const countriesToShow = value
    ? countries.filter(country => country.toLowerCase().includes(value.toLowerCase()) === true)
    : []


  const handleChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />
      <Countries countriesToShow={countriesToShow} />
    </div>
  )
}

export default App