import { useEffect } from "react"
import { useState } from "react"
import weatherService from '../services/weather'

const kelvin = 274.15

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const featchWeather = async () => {
    try {
      setWeather(await weatherService.current(country))
    } catch (error) {
      console.error('Failed to fetch weather')
    }
  }

  useEffect(() => {
    if (!country) return;
    featchWeather()
  }, [country])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map((e) => <li key={e}>{e}</li>)}
      </ul>
      <img src={country.flags.png} alt='flag' />
      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>temperature {(weather.main.temp - kelvin).toFixed(2)} Celcius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const Countries = ({ countries }) => {
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    setExpanded({})
  }, [countries])
  if (!countries?.length) {
    return <p>No results, specify another filter</p>
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    return (
      <CountryDetails country={countries[0]} />
    )
  }
  return (
    <div>
      {countries.map((c) =>
        <div key={c.name.common}>
          <p>
            {c.name.common}
            <button onClick={() => setExpanded({ ...expanded, [c.name.common]: !expanded[c.name.common] })}>
              {expanded[c.name.common] ? 'hide' : 'show'}
            </button>
          </p>
          {expanded[c.name.common] && <CountryDetails country={c} />}
        </div>
      )}
    </div >
  )
}
export default Countries