import axios from 'axios';

const apiKey = import.meta.env.API_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const current = async (country) => {
  const res = await axios.get(`${baseUrl}?q=${country.capital},${country.cca2}&APPID=${apiKey}`)
  return res.data
}

export default {
  current
}