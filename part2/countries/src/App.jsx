import { useEffect } from 'react'
import { useState } from 'react'
import Countries from './components/Countries'
import countryService from './services/countries'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    if (!search) {
      setFilteredCountries([]);
      return
    }
    setFilteredCountries(
      countries
        .filter((e) => e.name.common
          .toLowerCase()
          .search(search.toLowerCase()) >= 0)
    )
  }, [countries, search])

  const fetchCountries = async () => {
    try {
      setCountries(await countryService.getAll())
    } catch (error) {
      console.error('Failed to fetch countries', error.toString())
    }
  }

  useEffect(() => {
    fetchCountries();
  }, [])

  return (
    <div>
      <p>find countries <input value={search} onChange={(e) => setSearch(e.target.value)} /></p>
      <Countries countries={filteredCountries} />
    </div>
  )
}

export default App