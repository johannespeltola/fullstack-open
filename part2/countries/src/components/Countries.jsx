import { useEffect } from "react"
import { useState } from "react"

const CountryDetails = ({ country }) => {
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