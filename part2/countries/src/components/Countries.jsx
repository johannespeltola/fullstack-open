const Countries = ({ countries }) => {
  if (!countries?.length) {
    return <p>No results, specify another filter</p>
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <p>Capital {countries[0].capital[0]}</p>
        <p>Area {countries[0].area}</p>
        <h2>Languages:</h2>
        <ul>
          {Object.values(countries[0].languages).map((e) => <li key={e}>{e}</li>)}
        </ul>
        <img src={countries[0].flags.png} alt='flag' />
      </div>
    )
  }
  return (
    <div>
      {countries.map((c) => <p key={c.name.common}>{c.name.common}</p>)}
    </div>
  )
}
export default Countries